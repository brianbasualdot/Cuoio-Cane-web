import { api } from '@/lib/api';

export interface Product {
    id: string;
    slug: string;
    name: string;
    description?: string;
    care_instructions?: string;
    variants?: ProductVariant[];
    price?: number; // Computed
}

export interface ProductVariant {
    id: string;
    sku: string;
    size?: string;
    color?: string;
    price: number;
    stock_quantity: number;
}

export const productService = {
    getAll: async (): Promise<Product[]> => {
        return api.get('/products');
    },

    getBySlug: async (slug: string): Promise<Product> => {
        return api.get(`/products/${slug}`);
    },

    getFeatured: async (): Promise<Product[]> => {
        const products = await api.get('/products');
        return Array.isArray(products) ? products.slice(0, 4) : [];
    }
};
