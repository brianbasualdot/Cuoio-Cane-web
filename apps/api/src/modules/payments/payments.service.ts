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
        // Initialize MercadoPago Client
        // Note: If token is missing during dev, methods will fail.
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

        // 2. Create Preference
        const preference = new Preference(this.client);

        // Create Item List for MP
        unit_price: Number(item.unit_price),
        }));

        // HARD VALIDATION: Re-check coupon
        let finalTotal = order.items_subtotal;
let discountAmount = 0;

if (order.coupon_code) {
    const validation = await this.discountsService.validateCoupon(
        order.coupon_code,
        order.items_subtotal,
        order.order_items.map(i => i.product_variant_id)
    );

    if (validation.valid) {
        discountAmount = validation.discountAmount;
        await this.discountsService.incrementUsage(validation.coupon.id);
    } else {
        console.warn(`Coupon ${order.coupon_code} invalid during payment init: ${validation.message}`);
        // If invalid, we ignore the discount. `discountAmount` remains 0.
    }
}

finalTotal = finalTotal - discountAmount;
const shipping = Number(order.shipping_cost);
const preferenceTotal = finalTotal + shipping;

// ADJUST ITEMS FOR MP:
// We cannot send negative items easily without risk (some MP versions reject).
// Best approach: Send one single item "Compra en Cuoio Cane" with the final total?
// OR: Send real items and shipping, and a "Descuento" item with negative price IF valid.
// User said: "NO enviar info del cupón a MercadoPago" and "Monto final ya descontado".
// Strategy: Send items as is, but scale their unit_price? No, complex rounding.
// Strategy: Send 1 item "Total a Pagar (Orden #...)"

// Reset items to ensure total match
const mpItems = [{
    id: order.id,
    title: `Orden #${order.id.slice(0, 8)}`,
    quantity: 1,
    unit_price: preferenceTotal
}];

// Add Shipping as Item (MP standard way if not using their shipping calculation)
/*
// Original Logic disabled to favor "Total Amount" item
if (order.shipping_cost > 0) {
    items.push({
        id: 'shipping',
        title: 'Costo de Envío',
        quantity: 1,
        unit_price: Number(order.shipping_cost),
    });
}
*/

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
            // Webhook URL (must be public HTTPS)
            notification_url: `${this.configService.get('API_URL')}/payments/webhook`,
        }
    });

    // 3. Record Payment Attempt (Optional, or just return init_point)
    await this.supabase.from('payments').insert({
        order_id: order.id,
        provider: 'mercadopago',
        amount: order.total_amount,
        status: 'pending',
        metadata: { preference_id: response.id },
    });

    return { init_point: response.init_point, preference_id: response.id };

} catch (e) {
    throw new InternalServerErrorException('Failed to create MP Preference: ' + e.message);
}
    }

    async handleWebhook(query: any, body: any) {
    // Minimal implementation: Fetch payment info from MP using ID from webhook query/body
    // MP sends `data.id` or `id` depending on version/topic.

    // Detailed logic requires 'Payment' resource from mercadopago SDK to get status.
    // For now, logging payload to Audit Logs via a generic log function or similar.

    // TODO: Verify signature and fetch status.
    // Update order status based on 'status' == 'approved'.

    return { status: 'received' };
}
}
