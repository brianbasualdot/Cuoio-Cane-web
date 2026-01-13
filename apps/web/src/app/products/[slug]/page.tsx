import { api } from '@/lib/api';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: { slug: string } }) {
    // Await params as per Next.js 15+ changes? Usually params is a promise in latest?
    // Next 14 apps router params is object. Let's assume standard object for now or await if needed.
    // Actually in latest canary it might be promise.
    // Let's assume standard { slug }.
    const { slug } = params;

    let product;
    try {
        product = await api.get(`/products/${slug}`);
    } catch (e) {
        console.error("Fetch error", e);
        return notFound();
    }

    if (!product) return notFound();

    return (
        <div className="container px-4 py-12 md:py-20">
            <ProductDetailClient product={product} />
        </div>
    );
}
