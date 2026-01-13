import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateProductDto, UpdateProductDto } from './products.dto';

@Injectable()
export class ProductsService {
    constructor(
        @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    ) { }

    // PUBLIC READ
    async findAll() {
        const { data, error } = await this.supabase
            .from('products')
            .select('*, variants:product_variants(*)')
            .eq('is_active', true);

        if (error) throw new InternalServerErrorException(error.message);
        return data;
    }

    async findOne(slug: string) {
        const { data, error } = await this.supabase
            .from('products')
            .select('*, variants:product_variants(*)')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error || !data) throw new NotFoundException('Product not found');
        return data;
    }

    // PROTECTED WRITE (Admin/Staff)
    async create(createProductDto: CreateProductDto) {
        const { variants, ...productData } = createProductDto;

        // Transaction-like logic (Supabase doesn't support full transactions via JS client easily without RPC, 
        // but we can chain. Ideally usage of RPC or Backend procedure is better for atomicity).
        // For MVP, we insert product then variants.

        const { data: product, error: prodError } = await this.supabase
            .from('products')
            .insert(productData)
            .select()
            .single();

        if (prodError) throw new InternalServerErrorException(prodError.message);

        if (variants && variants.length > 0) {
            const variantsWithProductId = variants.map((v) => ({ ...v, product_id: product.id }));
            const { error: varError } = await this.supabase
                .from('product_variants')
                .insert(variantsWithProductId);

            if (varError) {
                // Rollback product? (Manual compensation)
                await this.supabase.from('products').delete().eq('id', product.id);
                throw new InternalServerErrorException('Failed to create variants: ' + varError.message);
            }
        }

        return this.findOne(product.slug);
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const { variants, ...productData } = updateProductDto;

        const { data, error } = await this.supabase
            .from('products')
            .update(productData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new InternalServerErrorException(error.message);

        // Note: Variant update logic is complex (add/remove/update). 
        // For MVP/Updates, usually we handle variants via separate endpoints or full replace.
        // Here we just return the updated product. 
        // If variants need update, use specific variant endpoints or better logic.

        return data;
    }

    async remove(id: string) {
        const { error } = await this.supabase.from('products').delete().eq('id', id);
        if (error) throw new InternalServerErrorException(error.message);
        return { message: 'Product deleted successfully' };
    }
}
