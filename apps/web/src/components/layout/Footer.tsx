export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/20">
            <div className="container py-12 px-4 md:py-16 lg:py-20">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="text-lg font-serif font-semibold text-primary mb-4">CUOIO CANE</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Artesanía en cuero para quienes caminan a nuestro lado.<br />
                            Hecho a mano en Argentina.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-4 text-foreground">Ayuda</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:underline">Envíos y Devoluciones</a></li>
                            <li><a href="#" className="hover:underline">Guía de Talles</a></li>
                            <li><a href="#" className="hover:underline">Cuidado del Cuero</a></li>
                            <li><a href="#" className="hover:underline">Contacto</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-4 text-foreground">Pagos Seguros</h4>
                        <div className="flex space-x-2 text-sm text-muted-foreground">
                            <span>Mercado Pago</span>
                            <span>•</span>
                            <span>Tarjetas</span>
                            <span>•</span>
                            <span>Transferencia</span>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-border pt-8 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Cuoio Cane. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
