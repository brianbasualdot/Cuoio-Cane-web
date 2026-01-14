'use client';


import { useCartStore } from '@/lib/store';
import { api } from '@/lib/api';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { ShippingSelector } from '@/components/checkout/ShippingSelector';
import { PaymentSelector } from '@/components/checkout/PaymentSelector';
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary';
import { checkoutButtonVariants } from '@/lib/motion/checkout';

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);

    const [shippingMethod, setShippingMethod] = useState('andreani');
    const [paymentMethod, setPaymentMethod] = useState('mercadopago');

    // Basic Form State (Use React Hook Form in production)
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        zip: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Calculate details
    const subtotal = totalPrice();
    const shippingCost = shippingMethod === 'pickup' ? 0 : 5000; // Mock cost

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Order
            const orderPayload = {
                customer_email: formData.email,
                customer_full_name: formData.fullName,
                customer_phone: formData.phone,
                shipping_address: {
                    street: formData.address,
                    city: formData.city,
                    province: formData.province,
                    zip_code: formData.zip,
                    number: '123' // Mock
                },
                shipping_method: shippingMethod,
                items: items.map(item => ({
                    variant_id: item.variantId,
                    quantity: item.quantity
                }))
            };

            const order = await api.post('/orders', orderPayload);

            // 2. Init Payment
            const paymentInit = await api.post(`/payments/init/${order.id}`, { method: paymentMethod });

            // 3. Clear Cart & Redirect
            clearCart();
            window.location.href = paymentInit.init_point;

        } catch (error) {
            console.error('Checkout error', error);
            alert('Error al procesar la orden. Verificá los datos e intentá nuevamente.');
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-serif mb-4">Tu carrito está vacío</h1>
                <Link href="/products" className="text-primary hover:underline">Volver a la tienda</Link>
            </div>
        );
    }


    return (
        <div className="container px-4 py-24 md:py-32 max-w-5xl">
            <h1 className="text-sm font-medium tracking-[0.3em] text-muted-foreground uppercase mb-16 border-b border-white/5 pb-6">
                Finalizar Compra
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
                {/* Form */}
                <div className="space-y-16">
                    {/* DIV 1 — Datos del cliente */}
                    <section>
                        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60 mb-8">Contacto</h2>
                        <div className="grid gap-6">
                            <AnimatedInput required name="email" type="email" label="Email" value={formData.email} onChange={handleChange} />
                            <AnimatedInput required name="fullName" type="text" label="Nombre Completo" value={formData.fullName} onChange={handleChange} />
                            <AnimatedInput required name="phone" type="tel" label="Teléfono" value={formData.phone} onChange={handleChange} />
                        </div>
                    </section>

                    {/* DIV 2 — Envío */}
                    <section>
                        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60 mb-8">Entrega</h2>
                        <div className="mb-8">
                            <ShippingSelector
                                selectedId={shippingMethod}
                                onSelect={setShippingMethod}
                                options={[
                                    { id: 'andreani', name: 'Envío a Domicilio', price: 5000, description: 'Cobertura nacional. 3-5 días hábiles.' },
                                    { id: 'pickup', name: 'Retiro en Showroom', price: 0, description: 'Palermo Soho. Cita previa.' }
                                ]}
                            />
                        </div>

                        {shippingMethod !== 'pickup' && (
                            <div className="grid gap-6">
                                <AnimatedInput required name="address" type="text" label="Dirección y Altura" value={formData.address} onChange={handleChange} />
                                <div className="grid grid-cols-2 gap-6">
                                    <AnimatedInput required name="city" type="text" label="Ciudad" value={formData.city} onChange={handleChange} />
                                    <AnimatedInput required name="zip" type="text" label="Código Postal" value={formData.zip} onChange={handleChange} />
                                </div>
                                <AnimatedInput required name="province" type="text" label="Provincia" value={formData.province} onChange={handleChange} />
                            </div>
                        )}
                    </section>

                    {/* DIV 3 — Pago (Selector part) */}
                    <section>
                        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60 mb-8">Pago</h2>
                        <PaymentSelector selectedId={paymentMethod} onSelect={setPaymentMethod} />
                    </section>

                    <div className="pt-8">
                        <motion.button
                            type="submit"
                            variants={checkoutButtonVariants}
                            initial="enabled"
                            animate={loading ? "disabled" : "enabled"}
                            whileHover={!loading ? "hover" : undefined}
                            whileTap={!loading ? "tap" : undefined}
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full h-16 bg-white text-black text-xs font-bold tracking-[0.25em] uppercase rounded-sm border border-transparent hover:bg-brand-platinum transition-colors"
                        >
                            {loading ? 'Procesando...' : 'Pagar y Finalizar'}
                        </motion.button>
                        <div className="flex justify-center mt-6">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 flex items-center gap-2">
                                <span className="w-1 h-1 bg-green-500/50 rounded-full"></span>
                                Transacción Encriptada 256-bit
                            </span>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="md:sticky md:top-24 h-fit">
                    <CheckoutSummary items={items} subtotal={subtotal} shippingCost={shippingCost} />
                </div>
            </div>
        </div>
    );
}
