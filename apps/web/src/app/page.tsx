import { api } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import Link from 'next/link';
import { MotionDiv, MotionSection, MotionH1, MotionP, MotionSpan } from '@/components/motion/MotionProxy';
import { fadeInUp, heroItem, staggerContainer } from '@/lib/motion';
import { sectionFadeVariants, materialTextVariants, lineRevealVariants } from '@/lib/motion/storytelling';
import { EmptyState } from '@/components/ui/EmptyState';

async function getFeaturedProducts() {
  try {
    const products = await api.get('/products');
    if (!products || !Array.isArray(products)) {
      return [];
    }
    return products.slice(0, 4);
  } catch (e) {
    return [];
  }
}

export default async function Home() {

  const products = await getFeaturedProducts();
  const featuredProducts = products.slice(0, 3); // Limit to 3

  return (
    <div className="flex flex-col bg-black text-brand-platinum overflow-x-hidden selection:bg-primary/20">

      {/* 2. LANDING CENTRAL (HERO) */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black z-0" />
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/80 via-black/40 to-black pointer-events-none" />
        {/* Subdued background */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-screen" />

        <MotionDiv
          className="relative z-20 flex flex-col items-center justify-center text-center space-y-12" // Increased space
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <MotionH1 variants={heroItem} className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-tight leading-none text-brand-platinum/90">
            CUOIO<br />CANE
          </MotionH1>
          <MotionP variants={heroItem} className="text-sm md:text-base tracking-[0.2em] uppercase text-brand-platinum/50 font-medium">
            Silencio . Presencia . Cuero
          </MotionP>
        </MotionDiv>
      </section>

      {/* 3. BLOQUES PRODUCTO (1 / 2 / 3) */}
      {/* "Tratar los tres como un conjunto. Mismo peso visual." */}
      <section className="container px-4 py-32 md:py-48 bg-black relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-20"> {/* 3 Columns */}
          {featuredProducts.length > 0 ? (
            featuredProducts.map((p: any, i: number) => (
              <MotionDiv
                key={p.id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: i * 0.1 }} // Subtle stagger
                className="group cursor-pointer"
              >
                {/* Product Card adapted for "Promesa" feel - minimalist */}
                <div className="aspect-[3/4] bg-neutral-900/20 relative overflow-hidden mb-6">
                  {/* Simplified Product Card Logic here or reuse component but styling needs to be quiet */}
                  <ProductCard product={p} />
                </div>
                {/* Minimal Info */}
                <div className="flex flex-col items-center space-y-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                  <h3 className="font-serif text-lg tracking-wide">{p.name}</h3>
                  <span className="text-xs tracking-widest text-muted-foreground">VER DETALLE</span>
                </div>
              </MotionDiv>
            ))
          ) : (
            <div className="col-span-3 text-center py-20 opacity-30">
              <span className="font-serif italic">Próximamente</span>
            </div>
          )}
        </div>
      </section>

      {/* 4. DETAILS */}
      {/* "Sobrio, honesto, técnico" */}
      <section className="py-32 md:py-48 bg-black border-t border-white/5">
        <div className="container px-4 space-y-32">

          {/* Material */}
          <MotionSection
            className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 opacity-80"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionFadeVariants}
          >
            <div className="flex-1 text-right space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Materia</h3>
              <p className="font-serif text-2xl md:text-3xl text-brand-platinum leading-relaxed">
                Cuero de curtiembre vegetal.
              </p>
            </div>
            <div className="w-[1px] h-32 bg-white/10 hidden md:block" />
            <div className="flex-1 text-left space-y-4">
              <p className="text-sm md:text-base text-muted-foreground/80 leading-loose max-w-sm">
                Sin correcciones artificiales. El material respira, cambia y envejece con dignidad. Imperfecto por naturaleza.
              </p>
            </div>
          </MotionSection>

          {/* Detail */}
          <MotionSection
            className="flex flex-col items-center justify-center space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionFadeVariants}
          >
            <svg width="1" height="80" className="overflow-visible">
              <MotionDiv as="line" x1="0" y1="0" x2="0" y2="80" stroke="white" strokeWidth="1" strokeOpacity="0.2" variants={lineRevealVariants} />
            </svg>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Técnica</p>
            <p className="font-serif text-xl text-brand-platinum/60">Construcción honesta. Sin adornos innecesarios.</p>
          </MotionSection>

        </div>
      </section>

      {/* 5. HISTORY */}
      {/* "Más humano, más lento. Origen, intención." */}
      <MotionSection
        className="py-32 md:py-48 bg-neutral-950/30 flex items-center justify-center px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionFadeVariants}
      >
        <div className="max-w-2xl text-center space-y-12">
          <span className="text-xs md:text-sm tracking-[0.3em] text-primary/40 uppercase">Manifesto</span>
          <p className="text-xl md:text-3xl font-serif leading-loose text-brand-platinum/80">
            "No diseñamos para la moda. Diseñamos para la permanencia. En un mundo ruidoso, elegimos la calma de los objetos bien hechos."
          </p>
          <div className="pt-8">
            <span className="text-xs text-muted-foreground/40 tracking-widest">— Buenos Aires, 2025</span>
          </div>
        </div>
      </MotionSection>

      {/* Values / Text Closure (Replaced by History mostly, but keeping small trademark if needed in Footer, dropping implicit section) */}

    </div>
  );
}
