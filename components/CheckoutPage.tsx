
import React, { useState, useEffect, useMemo } from 'react';
import type { Product } from '../types';

interface CartItem {
    product: Product;
    quantity: number;
    size?: string;
}

interface CheckoutPageProps {
  onBack: () => void;
  cartItems: CartItem[];
}

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, cartItems }) => {
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const subtotal = useMemo(() => cartItems.reduce((acc, item) => {
        const price = item.size && item.product.prices ? item.product.prices[item.size] : item.product.price;
        return acc + price * item.quantity;
    }, 0), [cartItems]);

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === '4EVERYOUNG') {
            setDiscount(subtotal * 0.05);
        } else {
            // Here you could add an error message for invalid coupons
            setDiscount(0);
        }
    };
    
    const deliveryCharge = 150;
    const total = subtotal + deliveryCharge - discount;

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onClick={onBack} className="inline-flex items-center text-sm font-medium text-maroon-700 hover:text-maroon-900 mb-6">
                    <ArrowLeftIcon />
                    Back to shop
                </button>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-900 text-center mb-10">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                    {/* Left Side: Forms */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-lg font-semibold text-maroon-900 mb-4">Contact Information</h2>
                            <input type="email" placeholder="Email address" className="block w-full rounded-md border-maroon-200 shadow-sm focus:border-maroon-700 focus:ring-maroon-700" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-maroon-900 mb-4">Shipping Address</h2>
                            <div className="space-y-4">
                                <input type="text" placeholder="Full Name" className="block w-full rounded-md border-maroon-200 shadow-sm focus:border-maroon-700 focus:ring-maroon-700" />
                                <input type="text" placeholder="Mobile Number" className="block w-full rounded-md border-maroon-200 shadow-sm focus:border-maroon-700 focus:ring-maroon-700" />
                                <textarea placeholder="Address" rows={3} className="block w-full rounded-md border-maroon-200 shadow-sm focus:border-maroon-700 focus:ring-maroon-700"></textarea>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="City" className="block w-full rounded-md border-maroon-200 shadow-sm focus:border-maroon-700 focus:ring-maroon-700" />
                                    <input type="text" placeholder="Postal Code" className="block w-full rounded-md border-maroon-200 shadow-sm focus:border-maroon-700 focus:ring-maroon-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-maroon-100 self-start lg:sticky lg:top-24">
                        <h2 className="text-lg font-semibold text-maroon-900 mb-4">Order Summary</h2>
                        <ul role="list" className="divide-y divide-maroon-200">
                            {cartItems.map(({ product, quantity, size }) => (
                                <li key={product.id + (size || '')} className="flex py-4">
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-maroon-200">
                                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover object-center" />
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                            <div className="flex justify-between text-base font-medium text-maroon-900">
                                                <h3>{product.name}</h3>
                                                <p className="ml-4">{((size && product.prices?.[size] || product.price) * quantity).toFixed(2)}৳</p>
                                            </div>
                                            {size && <p className="mt-1 text-sm text-maroon-500">{size}</p>}
                                        </div>
                                        <p className="text-sm text-maroon-500">Qty {quantity}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 space-y-2 border-t border-maroon-200 pt-6">
                            <div className="flex items-center gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Coupon code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="block w-full rounded-md border-maroon-200 shadow-sm focus:border-maroon-700 focus:ring-maroon-700"
                                />
                                <button onClick={handleApplyCoupon} className="rounded-md bg-maroon-100 px-4 py-2 text-sm font-semibold text-maroon-800 hover:bg-maroon-200 transition-colors">Apply</button>
                            </div>
                            <div className="flex justify-between text-sm text-maroon-800">
                                <p>Subtotal</p>
                                <p>{subtotal.toFixed(2)}৳</p>
                            </div>
                            <div className="flex justify-between text-sm text-maroon-800">
                                <p>Delivery Charge</p>
                                <p>{deliveryCharge.toFixed(2)}৳</p>
                            </div>
                             {discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600 font-semibold">
                                    <p>Discount (5%)</p>
                                    <p>-{discount.toFixed(2)}৳</p>
                                </div>
                            )}
                            <div className="flex justify-between text-base font-bold text-maroon-900 border-t border-maroon-200 pt-4 mt-4">
                                <p>Total</p>
                                <p>{total.toFixed(2)}৳</p>
                            </div>
                        </div>
                        <div className="mt-8">
                            <button className="w-full flex items-center justify-center rounded-md border border-transparent bg-maroon-800 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-maroon-900 transition-colors">
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;