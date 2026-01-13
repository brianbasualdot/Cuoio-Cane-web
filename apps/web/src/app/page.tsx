import { api } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import Link from 'next/link';

async function getFeaturedProducts() {
  try {
    // In SSR we must ensure localhost works or use absolute URL
    // Ensure API is running!
    const products = await api.get('/products');
    return Array.isArray(products) ? products.slice(0, 4) : [];
  } catch (e) {
    console.error("Failed to fetch products", e);
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div className="flex flex-col gap-16 pb-20">

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center justify-center bg-secondary text-foreground overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        {/* Abstract Background or Image */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center" />

        <div className="relative z-20 container text-center px-4 space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-wider text-brand-platinum">
            ELEGANCIA<br />EN CADA PASEO
          </h1>
          <p className="max-w-xl mx-auto text-lg md:text-xl text-brand-platinum/80 font-light">
            Accesorios de cuero artesanal diseñados para perdurar.
            Calidad y distinción para tu compañero más fiel.
          </p>
          <div className="pt-8 opacity-0 animate-[fade-in-up_1s_ease-out_0.5s_forwards]">
            <Link
              href="/products"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground font-bold tracking-widest hover:bg-primary/90 transition-colors duration-500 rounded-sm shadow-lg shadow-orange-900/20"
            >
              EXPLORAR COLECCIÓN
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-primary">Favoritos</h2>
          <Link href="/products" className="group text-sm font-medium border-b border-transparent hover:border-primary transition-colors flex items-center gap-1">
            Ver todo <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground border border-dashed rounded-lg">
            <p>Nuestra colección se está preparando (API Connection Error or Empty).</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Values / Trust */}
      <section className="bg-muted/30 py-20">
        <div className="container px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-semibold">Cuero Legítimo</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Seleccionamos las mejores piezas de curtiembre vegetal para asegurar durabilidad y belleza natural.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-semibold">Hecho a Mano</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Cada collar y correa es confeccionado individualmente por artesanos en nuestro taller.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-semibold">Garantía de Calidad</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Comprometidos con la excelencia. Si no te enamora, lo cambiamos.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
