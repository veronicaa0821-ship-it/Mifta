
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import Hero from './components/Hero';
import ProductDetail from './components/ProductDetail';
import CheckoutPage from './components/CheckoutPage';
import AuthModal from './components/AuthModal';
import ImageSearchModal from './components/ImageSearchModal';
import Chatbot from './components/Chatbot';
import { PRODUCTS, CATEGORIES } from './constants';
import type { Product, User, CartItem } from './types';

const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckout, setIsCheckout] = useState(false);
  const [authModal, setAuthModal] = useState<'hidden' | 'register' | 'signin'>('hidden');
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleAuthFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.email && authForm.password) {
      setUser({ name: authForm.name || 'Jane Doe', email: authForm.email });
      setAuthModal('hidden');
      setAuthForm({ name: '', email: '', password: '' });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.name && authForm.email && authForm.password) {
      setUser({ name: authForm.name, email: authForm.email });
      setAuthModal('hidden');
      setAuthForm({ name: '', email: '', password: '' });
    }
  };

  const handleSignOut = () => {
    setUser(null);
  };

  const handleAddToCart = (product: Product, quantity: number, size?: string) => {
    setCart(prevCart => {
      const cartItemId = product.id + (size ? `-${size}` : '');
      const existingItem = prevCart.find(item => item.id === cartItemId);

      if (existingItem) {
        return prevCart.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { id: cartItemId, product, quantity, size }];
      }
    });
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQuantity: number) => {
    setCart(prevCart => prevCart.map(item =>
      item.id === cartItemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ));
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
  };
  
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return PRODUCTS;
    }
    return PRODUCTS.filter(product => product.category === selectedCategory || product.subcategory === selectedCategory);
  }, [selectedCategory]);

  const categoryTitle = useMemo(() => {
    if (selectedCategory === 'All') return 'Our Collection';
    const allCategories = CATEGORIES.flatMap(cat => cat.subcategories ? [cat, ...cat.subcategories] : [cat]);
    const currentCategory = allCategories.find(cat => cat.name === selectedCategory);
    return currentCategory ? currentCategory.name : 'Products';
  }, [selectedCategory]);

  const handleGoToCheckout = () => {
    setSelectedProduct(null);
    setIsCheckout(true);
  };
  
  if (isCheckout) {
    return <CheckoutPage cartItems={cart} onBack={() => setIsCheckout(false)} />;
  }

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} onGoToCheckout={handleGoToCheckout} onAddToCart={handleAddToCart} />;
  }

  const SignInContent = () => (
    <form onSubmit={handleSignIn} className="space-y-4">
        <input type="email" name="email" placeholder="Email Address" required value={authForm.email} onChange={handleAuthFormChange} className="block w-full rounded-md border-maroon-200 shadow-sm focus:border-maroon-700 focus:ring-maroon-700 p-2.5" />
        <input type="password" name="password" placeholder="Password" required value={authForm.password} onChange={handleAuthFormChange} className="block w-full rounded-md border-maroon-200 shadow-sm focus:border-maroon-700 focus:ring-maroon-700 p-2.5" />
        <button type="submit" className="w-full flex items-center justify-center rounded-md border border-transparent bg-maroon-800 px-6 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-maroon-900 transition-colors">Sign In</button>
        <div className="relative flex py-2 items-center"><div className="flex-grow border-t border-maroon-200"></div><span className="flex-shrink mx-4 text-sm text-maroon-500">or</span><div className="flex-grow border-t border-maroon-200"></div></div>
        <button type="button" className="w-full flex items-center justify-center rounded-md border border-maroon-300 bg-white px-6 py-2.5 text-base font-medium text-maroon-800 shadow-sm hover:bg-maroon-100 transition-colors"><GoogleIcon /> Continue with Google</button>
    </form>
  );

  const RegisterContent = () => (
     <form onSubmit={handleRegister} className="space-y-4">
        <input type="text" name="name" placeholder="Full Name" required value={authForm.name} onChange={handleAuthFormChange} className="block w-full rounded-md border-maroon-200 shadow-sm focus:border-maroon-700 focus:ring-maroon-700 p-2.5" />
        <input type="email" name="email" placeholder="Email Address" required value={authForm.email} onChange={handleAuthFormChange} className="block w-full rounded-md border-maroon-200 shadow-sm focus:border-maroon-700 focus:ring-maroon-700 p-2.5" />
        <input type="password" name="password" placeholder="Password" required minLength={6} value={authForm.password} onChange={handleAuthFormChange} className="block w-full rounded-md border-maroon-200 shadow-sm focus:border-maroon-700 focus:ring-maroon-700 p-2.5" />
        <button type="submit" className="w-full flex items-center justify-center rounded-md border border-transparent bg-maroon-800 px-6 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-maroon-900 transition-colors">Create Account</button>
        <div className="relative flex py-2 items-center"><div className="flex-grow border-t border-maroon-200"></div><span className="flex-shrink mx-4 text-sm text-maroon-500">or</span><div className="flex-grow border-t border-maroon-200"></div></div>
        <button type="button" className="w-full flex items-center justify-center rounded-md border border-maroon-300 bg-white px-6 py-2.5 text-base font-medium text-maroon-800 shadow-sm hover:bg-maroon-100 transition-colors"><GoogleIcon /> Continue with Google</button>
    </form>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-maroon-50 text-maroon-900">
      <Header 
        user={user}
        cartItems={cart}
        onSelectCategory={(category) => {
          setSelectedCategory(category);
          setSelectedProduct(null);
          setIsCheckout(false);
        }} 
        selectedCategory={selectedCategory}
        onSearchClick={() => setIsSearchOpen(true)}
        onGoToCheckout={handleGoToCheckout}
        onOpenRegister={() => setAuthModal('register')}
        onOpenSignIn={() => setAuthModal('signin')}
        onSignOut={handleSignOut}
        onUpdateCartQuantity={handleUpdateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
      />
      <SearchBar 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onImageSearchClick={() => {
            setIsSearchOpen(false);
            setIsImageSearchOpen(true);
        }}
      />
      <ImageSearchModal 
        isOpen={isImageSearchOpen} 
        onClose={() => setIsImageSearchOpen(false)} 
        products={PRODUCTS}
        onProductClick={(product) => {
            setIsImageSearchOpen(false);
            setSelectedProduct(product);
        }}
      />
      
      {selectedCategory === 'All' && <Hero />}

      <main className={`flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 ${selectedCategory === 'All' ? 'pt-16' : 'pt-8'}`}>
        {selectedCategory !== 'All' && (
            <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-4xl font-serif font-bold text-maroon-900 tracking-tight sm:text-5xl">{categoryTitle}</h2>
            </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onProductClick={setSelectedProduct} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-maroon-800">No Products Found</h2>
            <p className="text-maroon-600 mt-2">There are no products available in this category.</p>
          </div>
        )}
      </main>
      
      <AuthModal 
        isOpen={authModal !== 'hidden'} 
        onClose={() => setAuthModal('hidden')} 
        title={authModal === 'register' ? 'Create an Account' : 'Sign In to Zephyra'}
      >
        {authModal === 'register' ? <RegisterContent /> : <SignInContent />}
      </AuthModal>
      
      <Chatbot products={PRODUCTS} />
      <Footer />
    </div>
  );
};

export default App;
