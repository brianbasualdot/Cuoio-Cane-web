import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateOrderDto } from './orders.dto';
import { DiscountsService } from '../discounts/discounts.service';

@Injectable()
export class OrdersService {
    constructor(
        @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
        private readonly discountsService: DiscountsService,
    ) { }

    async create(createOrderDto: CreateOrderDto, userId?: string) {
        const { items, ...orderData } = createOrderDto;

        // 1. Fetch Variants and Products to validate stock and prices
        const variantIds = items.map((i) => i.variant_id);
        const { data: variants, error: varError } = await this.supabase
            .from('product_variants')
            .select('*, products(name)')
            .in('id', variantIds);

        if (varError || !variants || variants.length !== items.length) {
            throw new BadRequestException('Invalid products or variants');
        }

        // 2. Validate Stock & Calculate Totals
        let itemsSubtotal = 0;
        const orderItemsPayload = [];

        for (const item of items) {
            const variant = variants.find((v) => v.id === item.variant_id);
            if (!variant) throw new BadRequestException(`Variant ${item.variant_id} not found`);

            if (variant.stock_quantity < item.quantity) {
                throw new BadRequestException(`Insufficient stock for ${variant.products['name']} (${variant.sku})`);
            }

            const unitPrice = Number(variant.price);
            itemsSubtotal += unitPrice * item.quantity;

            orderItemsPayload.push({
                product_variant_id: variant.id,
                product_name: variant.products['name'],
                variant_sku: variant.sku,
                quantity: item.quantity,
                unit_price: unitPrice,
            });
        }

        // 3. Calculate Shipping (Mock Logic for now)
        let shippingCost = 0;
        if (orderData.shipping_method !== 'pickup') {
            // Flat rate logic or real calculation can go here
            shippingCost = 8000;
        }

        // 3.5 Calculate Discount
        let discountAmount = 0;
        if (orderData.coupon_code) {
            const validation = await this.discountsService.validateCoupon(
                orderData.coupon_code,
                itemsSubtotal,
                items.map(i => i.variant_id) // Ideally checks product IDs, but service handles logic
            );
            if (validation.valid) {
                discountAmount = validation.discountAmount;
            }
            // We allow creating an order with an invalid coupon, just with 0 discount? 
            // Or throw? Prompt says "Validación Blanda (Frontend)... Validación Dura (Backend al crear preference)".
            // Creating Order is before Preference. Let's just apply it if valid, ignore if not?
            // Or throw error to notify frontend?
            // Since frontend calls /validate first, this should be valid. If not, it's better to accept the order without discount 
            // or reject it. Let's accept it but define discount as 0 if invalid.
        }

        const totalAmount = itemsSubtotal + shippingCost - discountAmount;
        if (totalAmount < 0) throw new BadRequestException('Total cannot be negative');

        // 4. Create Order (Ideally Transactional)
        const { data: order, error: orderError } = await this.supabase
            .from('orders')
            .insert({
                user_id: userId || null,
                customer_email: orderData.customer_email,
                customer_full_name: orderData.customer_full_name,
                customer_phone: orderData.customer_phone,
                status: 'pending',
                currency: 'ARS',
                items_subtotal: itemsSubtotal,
                shipping_cost: shippingCost,
                discount_amount: discountAmount,
                total_amount: totalAmount,
                shipping_address: orderData.shipping_address,
                coupon_code: discountAmount > 0 ? orderData.coupon_code : null, // Only store code if applied
            })
            .select()
            .single();

        if (orderError) throw new InternalServerErrorException('Failed to create order: ' + orderError.message);

        // 5. Insert Items
        const itemsWithOrderId = orderItemsPayload.map(i => ({ ...i, order_id: order.id }));
        const { error: itemsError } = await this.supabase.from('order_items').insert(itemsWithOrderId);

        if (itemsError) {
            // Manual Rollback
            await this.supabase.from('orders').delete().eq('id', order.id);
            throw new InternalServerErrorException('Failed to create order items: ' + itemsError.message);
        }

        // 6. Decrement Stock
        // Note: Concurrency handling is tricky without atomic DB functions.
        // For critical production, use an RPC call or Database Function.
        // Here we implement individual updates (optimistic, risky for high concurrency).
        // TODO: Move to RPC
        for (const item of items) {
            await this.supabase.rpc('decrement_stock', { variant_id: item.variant_id, qty: item.quantity });
            // We will need to create this RPC function in DB migration if we want it robust
        }

        return order;
    }
}
