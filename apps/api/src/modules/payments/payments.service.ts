import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { ConfigService } from '@nestjs/config';
import { DiscountsService } from '../discounts/discounts.service';

@Injectable()
export class PaymentsService {
    private client: MercadoPagoConfig;

    constructor(
        @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
        private configService: ConfigService,
        private discountsService: DiscountsService,
    ) {
        const accessToken = this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN');
        if (accessToken) {
            this.client = new MercadoPagoConfig({ accessToken });
        }
    }

    async initPayment(orderId: string) {
        // 1. Fetch Order
        const { data: order, error } = await this.supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', orderId)
            .single();

        if (error || !order) throw new NotFoundException('Order not found');

        if (!this.client) {
            throw new InternalServerErrorException('MercadoPago not configured');
        }

        // 2. Helper Logic: Re-validate Coupon (Hard Validation)
        let finalTotal = order.items_subtotal;
        let discountAmount = 0;

        if (order.coupon_code) {
            const validation = await this.discountsService.validateCoupon(
                order.coupon_code,
                order.items_subtotal,
                order.order_items.map((i: any) => i.product_variant_id)
            );

            if (validation.valid) {
                discountAmount = validation.discountAmount;
                await this.discountsService.incrementUsage(validation.coupon.id);
            } else {
                console.warn(`Coupon ${order.coupon_code} invalid during payment init: ${validation.message}`);
                // Discount remains 0 if invalid
            }
        }

        finalTotal = Math.max(0, finalTotal - discountAmount);
        const shipping = Number(order.shipping_cost);
        const preferenceTotal = finalTotal + shipping;

        // 3. Create Preference
        const preference = new Preference(this.client);

        // Define ONE single item for MP to avoid rounding issues and hide coupon logic
        const mpItems = [{
            id: order.id,
            title: `Orden #${order.id.slice(0, 8)}`,
            quantity: 1,
            unit_price: preferenceTotal
        }];

        try {
            const response = await preference.create({
                body: {
                    items: mpItems,
                    payer: {
                        email: order.customer_email,
                        name: order.customer_full_name,
                    },
                    external_reference: order.id,
                    back_urls: {
                        success: `${this.configService.get('FRONTEND_URL')}/checkout/success`,
                        failure: `${this.configService.get('FRONTEND_URL')}/checkout/failure`,
                        pending: `${this.configService.get('FRONTEND_URL')}/checkout/pending`,
                    },
                    auto_return: 'approved',
                    notification_url: `${this.configService.get('API_URL')}/payments/webhook`,
                }
            });

            // 4. Record Payment Attempt
            await this.supabase.from('payments').insert({
                order_id: order.id,
                provider: 'mercadopago',
                amount: order.total_amount, // Original Amount
                status: 'pending',
                metadata: { preference_id: response.id },
            });

            return { init_point: response.init_point, preference_id: response.id };

        } catch (e: any) {
            throw new InternalServerErrorException('Failed to create MP Preference: ' + e.message);
        }
    }

    async handleWebhook(query: any, body: any) {
        // Log webhook for debugging
        console.log('MP Webhook', { query, body });
        return { status: 'received' };
    }
}
