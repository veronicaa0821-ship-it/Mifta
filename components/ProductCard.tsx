
import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  return (
    <div onClick={() => onProductClick(product)} className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-xl cursor-pointer">
      {product.tag && (
        <div className="absolute top-3 left-3 z-10 rounded-full bg-maroon-700 px-3 py-1 text-xs font-semibold text-white">
          {product.tag}
        </div>
      )}
      <div className="aspect-square overflow-hidden bg-gray-200">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col items-center p-4 text-center">
        <h3 className="text-sm font-semibold text-maroon-900 min-h-[2.5rem] line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-maroon-500 uppercase tracking-wider">{product.subcategory || product.category}</p>
        <div className="mt-4 flex flex-1 items-end">
          <div className="relative h-8 flex items-center justify-center">
            {/* Price - visible by default, fades out on hover */}
            <p className="font-serif text-lg font-bold text-maroon-900 transition-opacity duration-300 group-hover:opacity-0">{product.price.toFixed(2)}৳</p>
            
            {/* Button - hidden by default, fades in on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="rounded-md bg-maroon-800 py-2 px-5 text-sm font-semibold text-white pointer-events-none">
                View Details
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;