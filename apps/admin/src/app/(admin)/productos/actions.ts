'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';


export interface ProductFormState {
    error: string | null;
}

export async function createProduct(currentState: ProductFormState, formData: FormData): Promise<ProductFormState> {
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

export async function deleteProduct(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get('id') as string;

    if (!id) return;

    await supabase.from('products').delete().eq('id', id);
    revalidatePath('/productos');
}

export async function toggleProductStatus(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get('id') as string;
    const currentStatus = formData.get('currentStatus') === 'true';

    if (!id) return;

    await supabase.from('products').update({ is_active: !currentStatus }).eq('id', id);
    revalidatePath('/productos');
}

export async function updateProduct(currentState: ProductFormState, formData: FormData): Promise<ProductFormState> {
    const supabase = await createClient();

    // Extract IDs
    const id = formData.get('id') as string;
    const variantId = formData.get('variantId') as string;

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('stock'));
    const sku = formData.get('sku') as string;
    const images = formData.getAll('images') as File[];

    if (!id || !name || !price || !sku) {
        return { error: 'ID, Nombre, Precio y SKU son requeridos.' };
    }

    // 1. Get current product to merge images/metadata if needed
    const { data: currentProduct, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError || !currentProduct) {
        return { error: 'Producto no encontrado.' };
    }

    // 2. Upload New Images
    const newImageUrls: string[] = [];
    for (const image of images) {
        if (image.size === 0 || image.name === 'undefined') continue;

        const fileExt = image.name.split('.').pop();
        const fileName = `${currentProduct.slug}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, image);

        if (uploadError) {
            console.error('Upload error:', uploadError);
            continue;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);

        newImageUrls.push(publicUrl);
    }

    const existingImages = currentProduct.metadata?.images || [];
    const allImages = [...existingImages, ...newImageUrls];

    // 3. Update Product
    const { error: updateError } = await supabase
        .from('products')
        .update({
            name,
            description,
            metadata: { ...currentProduct.metadata, images: allImages }
        })
        .eq('id', id);

    if (updateError) {
        return { error: 'Error al actualizar producto: ' + updateError.message };
    }

    // 4. Update Variant
    if (variantId) {
        const { error: variantError } = await supabase
            .from('product_variants')
            .update({
                sku,
                price,
                stock_quantity: stock
            })
            .eq('id', variantId);

        if (variantError) {
            return { error: 'Error al actualizar variante: ' + variantError.message };
        }
    } else {
        const { error: variantError } = await supabase
            .from('product_variants')
            .update({
                sku,
                price,
                stock_quantity: stock
            })
            .eq('product_id', id);

        if (variantError) {
            return { error: 'Error al actualizar variante (fallback): ' + variantError.message };
        }
    }

    revalidatePath('/productos');
    redirect('/productos');
}
