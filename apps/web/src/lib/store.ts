import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    variantId: string;
    sku: string;
    name: string; // Product Name
    variantName: string; // e.g. "Rojo - M"
    price: number;
    quantity: number;
    image?: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const items = get().items;
                const existingItem = items.find((i) => i.variantId === item.variantId);
                if (existingItem) {
                    set({
                        items: items.map((i) =>
                            i.variantId === item.variantId
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...items, item] });
                }
            },
            removeItem: (id) =>
                set({ items: get().items.filter((i) => i.variantId !== id) }),
            updateQuantity: (id, quantity) =>
                set({
                    items: get().items.map((i) =>
                        i.variantId === id ? { ...i, quantity } : i
                    ),
                }),
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
            totalPrice: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        }),
        {
            name: 'cuoiocane-cart',
        }
    )
);
