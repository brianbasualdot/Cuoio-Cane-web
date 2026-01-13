import { z } from 'zod';

export const shippingAddressSchema = z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
    zip_code: z.string().min(1),
    floor: z.string().optional(),
    apartment: z.string().optional(),
});

export const orderItemSchema = z.object({
    variant_id: z.string().uuid(),
    quantity: z.number().int().min(1),
});

export const createOrderSchema = z.object({
    customer_email: z.string().email(),
    customer_full_name: z.string().min(1),
    customer_phone: z.string().optional(),
    shipping_address: shippingAddressSchema,
    items: z.array(orderItemSchema).min(1),
    shipping_method: z.enum(['andreani', 'correo_argentino', 'pickup']),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
