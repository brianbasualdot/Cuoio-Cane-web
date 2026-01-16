import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { EditProductForm } from './EditProductForm';

export default async function EditPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient();

    // Fetch Product with Variants
    const { data: product } = await supabase
        .from('products')
        .select('*, variants:product_variants(*)')
        .eq('slug', params.slug)
        .single();

    if (!product) {
        notFound();
    }

    return (
        <EditProductForm product={product} />
    );
}
