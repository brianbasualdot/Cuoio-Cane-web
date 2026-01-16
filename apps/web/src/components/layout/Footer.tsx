import Link from 'next/link';
import { Button } from "@/components/ui/button"

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-black">
            <div className="container py-20 px-4">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    <div className="space-y-4">
                        <h3 className="text-xs font-serif tracking-[0.2em] text-brand-platinum/80">CUOIO CANE</h3>
                        <p className="text-xs text-muted-foreground/60 leading-relaxed max-w-xs">
                            Artesanía en cuero. <br />
                            Buenos Aires, Argentina.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-xs font-medium mb-6 text-muted-foreground/40 uppercase tracking-widest">Soporte</h4>
                        <ul className="space-y-3 text-xs text-muted-foreground/60">
                            <li><a href="#" className="hover:text-brand-platinum transition-colors">Envíos y Devoluciones</a></li>
                            <li><a href="#" className="hover:text-brand-platinum transition-colors">Guía de Talles</a></li>
                            <li><Link href="/cuidados" className="hover:text-brand-platinum transition-colors">Cuidados</Link></li>
                            <li><a href="#" className="hover:text-brand-platinum transition-colors">Contacto</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-medium mb-6 text-muted-foreground/40 uppercase tracking-widest">Pagos</h4>
                        <div className="flex space-x-3 text-xs text-muted-foreground/40">
                            <span>Mercado Pago</span>
                            <span>•</span>
                            <span>Tarjetas</span>
                            <span>•</span>
                            <span>Transferencia</span>
                        </div>
                    </div>
                </div>
                <div className="mt-20 border-t border-white/5 pt-8 text-center text-[10px] uppercase tracking-widest text-muted-foreground/30">
                    &copy; {new Date().getFullYear()} Cuoio Cane.
                </div>
            </div>
        </footer>
    );
}
