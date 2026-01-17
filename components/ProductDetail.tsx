
import React, { useState, useEffect, useRef } from 'react';
import type { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onGoToCheckout: () => void;
  onAddToCart: (product: Product, quantity: number, size?: string) => void;
}

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
);

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
);

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onGoToCheckout, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : undefined);
  const [displayImages, setDisplayImages] = useState(product.images || [product.imageUrl]);
  const [currentPrice, setCurrentPrice] = useState(product.price);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Refs for swipe interaction
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (product.prices && selectedSize && product.prices[selectedSize]) {
      setCurrentPrice(product.prices[selectedSize]);
    } else {
      setCurrentPrice(product.price);
    }

    const allImages = product.images || [product.imageUrl];
    if (product.id === 13 && allImages.length === 5) {
      const image440ml = allImages[0];
      const lifestyleImages = allImages.slice(1, 4);
      const image200ml = allImages[4];

      if (selectedSize === '200ml') {
        setDisplayImages([image200ml, ...lifestyleImages]);
      } else { 
        setDisplayImages([image440ml, ...lifestyleImages]);
      }
    } else {
      setDisplayImages(allImages);
    }
    setActiveImageIndex(0);
  }, [selectedSize, product]);
  
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
  };

  const handlePrevImage = () => {
      setActiveImageIndex((prevIndex) => (prevIndex - 1 + displayImages.length) % displayImages.length);
  };

  const getClientX = (e: React.MouseEvent | React.TouchEvent) => {
    return 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = getClientX(e);
    if (containerRef.current) {
        containerRef.current.style.transition = 'none';
    }
  };

  const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const currentX = getClientX(e);
    const offset = currentX - dragStartRef.current;
    setDragOffset(offset);
  };

  const handleInteractionEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    if (containerRef.current) {
        containerRef.current.style.transition = 'transform 0.3s ease-out';
    }

    const SWIPE_THRESHOLD = 50;
    if (dragOffset < -SWIPE_THRESHOLD) {
      handleNextImage();
    } else if (dragOffset > SWIPE_THRESHOLD) {
      handlePrevImage();
    }
    
    setDragOffset(0);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         <button onClick={onBack} className="inline-flex items-center text-sm font-medium text-maroon-700 hover:text-maroon-900 my-6">
          <ArrowLeftIcon />
          Back to products
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12">
          <div className="w-full md:sticky md:top-24 self-start">
             <div 
                className="relative aspect-square w-full overflow-hidden rounded-lg border border-maroon-100 bg-white shadow-sm cursor-grab active:cursor-grabbing"
                onMouseDown={handleInteractionStart}
                onTouchStart={handleInteractionStart}
                onMouseMove={handleInteractionMove}
                onTouchMove={handleInteractionMove}
                onMouseUp={handleInteractionEnd}
                onMouseLeave={handleInteractionEnd}
                onTouchEnd={handleInteractionEnd}
            >
                <div 
                    ref={containerRef}
                    className="flex h-full"
                    style={{
                        transform: `translateX(calc(-${activeImageIndex * 100}% + ${dragOffset}px))`,
                        transition: isDraggingRef.current ? 'none' : 'transform 0.3s ease-out'
                    }}
                >
                    {displayImages.map((image, idx) => (
                        <div key={idx} className="h-full w-full flex-shrink-0">
                             <img 
                                src={image} 
                                alt={`${product.name} view ${idx + 1}`} 
                                className="h-full w-full object-cover"
                                draggable="false"
                            />
                        </div>
                    ))}
                </div>
            </div>
          </div>

          <div className="w-full">
            <div className="py-8 md:py-0">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-900">{product.name}</h1>
                <p className="mt-2 text-sm text-maroon-600">{product.subcategory || product.category}</p>
                <p className="mt-4 font-serif text-3xl text-maroon-900">{(currentPrice * quantity).toFixed(2)}৳</p>
                
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 sm:gap-6">
                    {product.sizes && (
                        <div>
                            <h3 className="text-sm font-medium text-maroon-900">Size</h3>
                            <fieldset className="mt-2">
                                <legend className="sr-only">Choose a size</legend>
                                <div className="flex gap-3">
                                    {product.sizes.map(size => (
                                        <label key={size} className={`relative flex items-center justify-center rounded-md border py-2 px-4 text-sm font-medium uppercase transition-colors cursor-pointer ${selectedSize === size ? 'bg-maroon-800 text-white border-maroon-800' : 'bg-white text-maroon-800 border-maroon-200 hover:bg-maroon-100'}`}>
                                            <input type="radio" name="size-choice" value={size} className="sr-only" checked={selectedSize === size} onChange={() => setSelectedSize(size)} />
                                            <span>{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        </div>
                    )}
                    <div>
                        <h3 className="text-sm font-medium text-maroon-900">Quantity</h3>
                        <div className="mt-2 flex items-center">
                            <button 
                                type="button"
                                onClick={() => handleQuantityChange(-1)}
                                className="h-9 w-9 flex items-center justify-center rounded-l-md border border-maroon-200 bg-white text-maroon-800 hover:bg-maroon-100 transition-colors focus:outline-none focus:ring-2 focus:ring-maroon-700 disabled:opacity-50"
                                aria-label="Decrease quantity"
                                disabled={quantity <= 1}
                            >
                                <MinusIcon />
                            </button>
                            <div className="h-9 w-12 flex items-center justify-center border-t border-b border-maroon-200 bg-white text-maroon-900 font-semibold" aria-live="polite">
                                {quantity}
                            </div>
                            <button 
                                type="button"
                                onClick={() => handleQuantityChange(1)}
                                className="h-9 w-9 flex items-center justify-center rounded-r-md border border-maroon-200 bg-white text-maroon-800 hover:bg-maroon-100 transition-colors focus:outline-none focus:ring-2 focus:ring-maroon-700"
                                aria-label="Increase quantity"
                            >
                                <PlusIcon />
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8">
                    <h3 className="text-sm font-medium text-maroon-900">Description</h3>
                    <p className="mt-2 text-base text-maroon-700 leading-relaxed">{product.description || 'No description available for this product.'}</p>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleAddToCartClick}
                    className={`flex-1 rounded-md border border-transparent py-3 px-8 text-base font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${isAdded ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-maroon-800 hover:bg-maroon-900 focus:ring-maroon-700'}`}
                  >
                    {isAdded ? 'Added!' : 'Add to cart'}
                  </button>
                  <button
                    type="button"
                    onClick={onGoToCheckout}
                    className="flex-1 rounded-md border border-maroon-300 bg-maroon-50 py-3 px-8 text-base font-semibold text-maroon-800 shadow-sm hover:bg-maroon-100 focus:outline-none focus:ring-2 focus:ring-maroon-700 focus:ring-offset-2 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
