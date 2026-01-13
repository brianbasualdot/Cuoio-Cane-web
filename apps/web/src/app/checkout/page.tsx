'use client';

import { useCartStore } from '@/lib/store';
import { api } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
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
                shipping_method: 'andreani', // Mock
                items: items.map(item => ({
                    variant_id: item.variantId,
                    quantity: item.quantity
                }))
            };

            const order = await api.post('/orders', orderPayload);

            // 2. Init Payment
            const paymentInit = await api.post(`/payments/init/${order.id}`, {});

            // 3. Clear Cart & Redirect to MP
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
                <a href="/products" className="text-primary hover:underline">Volver a la tienda</a>
            </div>
        );
    }

    return (
        <div className="container px-4 py-12 md:py-20 max-w-4xl">
            <h1 className="text-3xl font-serif text-primary mb-12 border-b pb-4">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Form */}
                <div>
                    <h2 className="text-lg font-semibold mb-6">Datos de Envío</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input required name="email" type="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-input rounded-sm bg-background" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                            <input required name="fullName" type="text" value={formData.fullName} onChange={handleChange} className="w-full p-2 border border-input rounded-sm bg-background" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Teléfono</label>
                            <input required name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-input rounded-sm bg-background" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Dirección</label>
                                <input required name="address" type="text" value={formData.address} onChange={handleChange} className="w-full p-2 border border-input rounded-sm bg-background" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Código Postal</label>
                                <input required name="zip" type="text" value={formData.zip} onChange={handleChange} className="w-full p-2 border border-input rounded-sm bg-background" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Ciudad</label>
                                <input required name="city" type="text" value={formData.city} onChange={handleChange} className="w-full p-2 border border-input rounded-sm bg-background" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Provincia</label>
                                <input required name="province" type="text" value={formData.province} onChange={handleChange} className="w-full p-2 border border-input rounded-sm bg-background" />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-primary text-primary-foreground font-bold tracking-widest hover:bg-primary/90 disabled:opacity-70 transition-colors uppercase"
                            >
                                {loading ? 'Procesando...' : 'Ir a Pagar'}
                            </button>
                            <p className="text-xs text-center mt-4 text-muted-foreground">
                                Pagos procesados de forma segura por Mercado Pago.
                            </p>
                        </div>
                    </form>
                </div>

                {/* Summary */}
                <div className="bg-muted/20 p-8 h-fit sticky top-24 rounded-sm">
                    <h2 className="text-lg font-semibold mb-6">Resumen de Compra</h2>
                    <div className="space-y-4 mb-6">
                        {items.map(item => (
                            <div key={item.variantId} className="flex justify-between text-sm">
                                <span>{item.name} ({item.variantName}) x {item.quantity}</span>
                                <span>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalPrice())}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
