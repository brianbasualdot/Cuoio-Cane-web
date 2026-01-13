import { api } from '@/lib/api';

export interface CreateOrderPayload {
    customer_email: string;
    customer_full_name: string;
    customer_phone?: string;
    shipping_address: {
        street: string;
        number: string;
        city: string;
        province: string;
        zip_code: string;
    };
    shipping_method: string;
    items: {
        variant_id: string;
        quantity: number;
    }[];
}

export interface Order {
    id: string;
    total_amount: number;
    status: string;
    // ... other fields
}

export const orderService = {
    create: async (payload: CreateOrderPayload): Promise<Order> => {
        return api.post('/orders', payload);
    }
};
