import { z } from 'zod';

// Variants Schema
export const productVariantSchema = z.object({
    sku: z.string().min(1),
    size: z.string().optional(),
    color: z.string().optional(),
    price: z.number().min(0),
    stock_quantity: z.number().int().min(0),
    is_active: z.boolean().default(true),
});

// Product Schema
export const createProductSchema = z.object({
    slug: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    care_instructions: z.string().optional(),
    is_active: z.boolean().default(true),
    metadata: z.record(z.string(), z.any()).default({}),
    variants: z.array(productVariantSchema).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
