
import React, { useRef, useEffect, useState } from 'react';
import type { Product } from '../types';

interface CartItem {
    product: Product;
    quantity: number;
    size?: string;
}

interface CartDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onGoToCheckout: () => void;
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
);

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
);


const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose, cartItems: initialCartItems, onGoToCheckout }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [cartItems, setCartItems] = useState(initialCartItems);

    useEffect(() => {
        // Reset local state when the dropdown is opened to reflect the parent's current state.
        if (isOpen) {
            setCartItems(initialCartItems);
        }
    }, [initialCartItems, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            // Add event listener after a short delay to prevent it from closing immediately
            setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 0);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleQuantityChange = (productId: number, size: string | undefined, change: number) => {
        setCartItems(currentItems =>
            currentItems.map(item => {
                if (item.product.id === productId && item.size === size) {
                    const newQuantity = item.quantity + change;
                    // Prevent quantity from going below 1
                    return { ...item, quantity: Math.max(1, newQuantity) };
                }
                return item;
            })
        );
    };

    const handleRemoveItem = (productId: number, size: string | undefined) => {
        setCartItems(currentItems =>
            currentItems.filter(item => !(item.product.id === productId && item.size === size))
        );
    };

    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.size && item.product.prices ? item.product.prices[item.size] : item.product.price;
        return acc + price * item.quantity;
    }, 0);

    return (
        <div
            ref={dropdownRef}
            className={`absolute top-full right-0 mt-2 w-80 max-w-sm rounded-lg bg-white shadow-2xl border border-maroon-100 z-50 overflow-hidden transition-all duration-200 ease-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
            aria-modal="true"
            role="dialog"
        >
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <h2 className="text-lg font-serif font-bold text-maroon-900" id="slide-over-title">
                        Shopping Cart
                    </h2>
                    <div className="ml-3 flex h-7 items-center">
                        <button
                            type="button"
                            className="-m-2 p-2 text-maroon-500 hover:text-maroon-800"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close panel</span>
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="flow-root">
                        {cartItems.length > 0 ? (
                             <ul role="list" className="-my-4 divide-y divide-maroon-200 max-h-60 overflow-y-auto">
                                {cartItems.map(({ product, quantity, size }) => (
                                    <li key={product.id + (size || '')} className="flex py-4">
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-maroon-200">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-maroon-900">
                                                    <h3>{product.name}</h3>
                                                    <p className="ml-4">{( (size && product.prices?.[size] || product.price) * quantity).toFixed(2)}৳</p>
                                                </div>
                                                {size && <p className="mt-1 text-sm text-maroon-500">{size}</p>}
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <div className="flex items-center border border-maroon-200 rounded-md">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityChange(product.id, size, -1)}
                                                        className="h-7 w-7 flex items-center justify-center text-maroon-700 hover:bg-maroon-100 rounded-l-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        aria-label="Decrease quantity"
                                                        disabled={quantity <= 1}
                                                    >
                                                        <MinusIcon />
                                                    </button>
                                                    <div className="h-7 w-8 text-center flex items-center justify-center text-maroon-900 font-medium" aria-live="polite">
                                                        {quantity}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityChange(product.id, size, 1)}
                                                        className="h-7 w-7 flex items-center justify-center text-maroon-700 hover:bg-maroon-100 rounded-r-md transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <PlusIcon />
                                                    </button>
                                                </div>
                                                <div className="flex">
                                                    <button type="button" className="font-medium text-maroon-700 hover:text-maroon-900" onClick={() => handleRemoveItem(product.id, size)}>
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-maroon-600 py-8">Your cart is empty.</p>
                        )}
                    </div>
                </div>
            </div>

            {cartItems.length > 0 && (
                <div className="border-t border-maroon-200 bg-maroon-50 px-4 py-4 sm:px-6">
                    <div className="flex justify-between text-base font-bold text-maroon-900">
                        <p>Subtotal</p>
                        <p>{subtotal.toFixed(2)}৳</p>
                    </div>
                    <p className="mt-0.5 text-sm text-maroon-600">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                        <button
                            onClick={onGoToCheckout}
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-maroon-800 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-maroon-900 transition-colors"
                        >
                            Checkout
                        </button>
                    </div>
                    <div className="mt-4 flex justify-center text-center text-sm text-maroon-600">
                        <p>
                            or{' '}
                            <button
                                type="button"
                                className="font-medium text-maroon-700 hover:text-maroon-900"
                                onClick={onClose}
                            >
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartDropdown;
