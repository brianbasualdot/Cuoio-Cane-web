import { api } from '@/lib/api';

export interface PaymentInitResponse {
    init_point: string;
    preference_id: string;
}

export const paymentService = {
    init: async (orderId: string): Promise<PaymentInitResponse> => {
        return api.post(`/payments/init/${orderId}`, {});
    }
};
