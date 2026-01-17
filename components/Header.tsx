
import React, { useState } from 'react';
import CategoryMenu from './CategoryMenu';
import { Logo } from './Logo';
import CartDropdown from './CartDropdown';
import AccountDropdown from './AccountDropdown';
import type { User, CartItem } from '../types';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CartIcon: React.FC<{ itemCount: number }> = ({ itemCount }) => (
  <div className="relative">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    {itemCount > 0 && (
      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-maroon-700 text-xs font-medium text-white">
        {itemCount}
      </span>
    )}
  </div>
);

const AccountIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CategoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

interface HeaderProps {
  user: User | null;
  cartItems: CartItem[];
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  onSearchClick: () => void;
  onGoToCheckout: () => void;
  onOpenRegister: () => void;
  onOpenSignIn: () => void;
  onSignOut: () => void;
  onUpdateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveFromCart: (cartItemId: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  cartItems,
  onSelectCategory,
  selectedCategory,
  onSearchClick,
  onGoToCheckout,
  onOpenRegister,
  onOpenSignIn,
  onSignOut,
  onUpdateCartQuantity,
  onRemoveFromCart,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const handleSelectCategory = (category: string) => {
    onSelectCategory(category);
    setIsMenuOpen(false);
  };
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 bg-maroon-50/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsMenuOpen(true)} className="p-2 text-maroon-800 hover:text-maroon-950 transition-colors">
                <span className="sr-only">Open categories</span>
                <CategoryIcon />
              </button>
            </div>

            <div className="flex-1 flex justify-center items-center">
              <div onClick={() => onSelectCategory('All')} className="cursor-pointer">
                <Logo className="h-8 text-maroon-900" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={onSearchClick} className="p-2 text-maroon-800 hover:text-maroon-950 transition-colors">
                <span className="sr-only">Search</span>
                <SearchIcon />
              </button>
              <div className="relative">
                <button onClick={() => { setIsCartOpen(prev => !prev); setIsAccountOpen(false); }} className="p-2 text-maroon-800 hover:text-maroon-950 transition-colors">
                  <span className="sr-only">Cart</span>
                  <CartIcon itemCount={totalItems}/>
                </button>
                <CartDropdown 
                    isOpen={isCartOpen} 
                    onClose={() => setIsCartOpen(false)} 
                    cartItems={cartItems} 
                    onGoToCheckout={onGoToCheckout}
                    onQuantityChange={(id, qty) => onUpdateCartQuantity(id, qty)}
                    onRemoveItem={(id) => onRemoveFromCart(id)}
                />
              </div>
              <div className="relative">
                <button onClick={() => { setIsAccountOpen(prev => !prev); setIsCartOpen(false); }} className="p-2 text-maroon-800 hover:text-maroon-950 transition-colors">
                  <span className="sr-only">Account</span>
                  <AccountIcon />
                </button>
                <AccountDropdown 
                    isOpen={isAccountOpen} 
                    onClose={() => setIsAccountOpen(false)} 
                    user={user}
                    onRegisterClick={() => { onOpenRegister(); setIsAccountOpen(false); }} 
                    onSignInClick={() => { onOpenSignIn(); setIsAccountOpen(false); }}
                    onSignOut={() => { onSignOut(); setIsAccountOpen(false); }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <CategoryMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onSelectCategory={handleSelectCategory} selectedCategory={selectedCategory} />
    </>
  );
};

export default Header;
