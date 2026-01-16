import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

export interface ValidationResult {
    valid: boolean;
    discountAmount: number;
    message?: string;
    coupon?: any;
}

@Injectable()
export class DiscountsService {
    constructor(
        @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    ) { }

    async validateCoupon(code: string, cartTotal: number, itemIds: string[]): Promise<ValidationResult> {
        if (!code) return { valid: false, discountAmount: 0 };

        // 1. Fetch Coupon
        const { data: discount, error } = await this.supabase
            .from('discounts')
            .select('*')
            .eq('code', code.toUpperCase())
            .single();

        if (error || !discount) {
            return { valid: false, discountAmount: 0, message: 'Cupón no existe' };
        }

        // 2. Validate Status
        if (!discount.active) {
            return { valid: false, discountAmount: 0, message: 'Cupón inactivo' };
        }

        // 3. Validate Date
        const now = new Date();
        if (discount.starts_at && new Date(discount.starts_at) > now) {
            return { valid: false, discountAmount: 0, message: 'Cupón aún no disponible' };
        }
        if (discount.expires_at && new Date(discount.expires_at) < now) {
            return { valid: false, discountAmount: 0, message: 'Cupón expirado' };
        }

        // 4. Validate Usage Limit
        if (discount.usage_limit !== null && discount.used_count >= discount.usage_limit) {
            return { valid: false, discountAmount: 0, message: 'Cupón agotado' };
        }

        // 5. Validate Min Purchase
        if (cartTotal < discount.min_purchase_amount) {
            return {
                valid: false,
                discountAmount: 0,
                message: `Monto mínimo de compra: $${discount.min_purchase_amount}`
            };
        }

        // 6. Calculate Discount
        let discountAmount = 0;

        if (discount.type === 'percentage') {
            discountAmount = (cartTotal * discount.value) / 100;
        } else if (discount.type === 'fixed') {
            discountAmount = discount.value;
        }

        // Ensure discount doesn't exceed total
        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }

        return {
            valid: true,
            discountAmount,
            coupon: discount
        };
    }

    async incrementUsage(id: string) {
        // Use RPC or atomic update if possible, for now simple counter increment
        const { error } = await this.supabase.rpc('increment_discount_usage', { discount_id: id });
        if (error) {
            // Fallback if RPC doesn't exist yet
            console.error('Failed to increment usage via RPC, ensure function exists', error);
        }
    }
}
