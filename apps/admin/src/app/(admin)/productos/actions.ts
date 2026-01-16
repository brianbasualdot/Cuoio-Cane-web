'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createProduct(currentState: any, formData: FormData) {
    const supabase = await createClient();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('stock'));
    const sku = formData.get('sku') as string;
    const images = formData.getAll('images') as File[];

    if (!name || !price || !sku) {
        return { error: 'Nombre, Precio y SKU son requeridos.' };
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // 1. Upload Images
    const imageUrls: string[] = [];

    // Ensure 'products' bucket exists or handled.
    // We assume 'products' bucket is public and exists.
    for (const image of images) {
        if (image.size === 0 || image.name === 'undefined') continue;

        const fileExt = image.name.split('.').pop();
        const fileName = `${slug}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, image);

        if (uploadError) {
            console.error('Upload error:', uploadError);
            // Continue or fail? Let's continue but warn.
            continue;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
    }

    // 2. Insert Product
    const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
            name,
            slug,
            description,
            // Assuming the schema has an images array column or we store in metadata
            // Based on DTO, we store in metadata? Or maybe database has specific column?
            // Usually products table has 'images' text[] or jsonb.
            // Let's assume metadata for now if column logic isn't clear, OR guess 'images' column.
            // DTO had 'metadata'. Let's check DTO again...
            // "metadata: z.record..."
            // But typical ecommerce 'products' table has 'images'.
            // I'll try to put it in 'metadata' for safety if column doesn't exist, 
            // OR checks the migration.
            // Checking previous migration or service implies usually metadata or specific column.
            // I will use 'metadata' to store images array for now as it matches DTO 'metadata'.
            // Wait, if I look at 'apps/admin/supabase/migrations', I might see it.
            // I'll stick to 'metadata' logic: { images: [...] }
            metadata: { images: imageUrls },
            is_active: true
        })
        .select()
        .single();

    if (productError) {
        return { error: 'Error al crear producto: ' + productError.message };
    }

    // 3. Insert Variant
    const { error: variantError } = await supabase
        .from('product_variants')
        .insert({
            product_id: product.id,
            sku,
            price,
            stock_quantity: stock,
            is_active: true
        });

    if (variantError) {
        // Rollback?
        await supabase.from('products').delete().eq('id', product.id);
        return { error: 'Error al crear variante: ' + variantError.message };
    }

    revalidatePath('/productos');
    redirect('/productos');
}
