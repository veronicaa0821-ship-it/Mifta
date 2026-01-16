
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import type { Category } from '../types';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronRightIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);


interface CategoryMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const CategoryMenuItem: React.FC<{ category: Category; onSelect: (name: string) => void; selected: string }> = ({ category, onSelect, selected }) => {
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelect = () => {
    if (hasSubcategories) {
      setIsExpanded(!isExpanded);
    } else {
      onSelect(category.name);
    }
  };

  return (
    <div>
      <div
        onClick={handleSelect}
        className={`flex justify-between items-center p-4 cursor-pointer text-lg font-medium transition-colors duration-200 ${selected === category.name && !hasSubcategories ? 'text-maroon-900 bg-maroon-100' : 'text-maroon-800 hover:bg-maroon-100'}`}
      >
        <span>{category.name}</span>
        {hasSubcategories && <ChevronRightIcon className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />}
      </div>
      {hasSubcategories && isExpanded && (
        <div className="pl-4 border-l border-maroon-200">
          {category.subcategories?.map(sub => (
            <div
              key={sub.name}
              onClick={() => onSelect(sub.name)}
              className={`p-3 cursor-pointer text-base transition-colors duration-200 ${selected === sub.name ? 'text-maroon-900 bg-maroon-100 font-semibold' : 'text-maroon-700 hover:bg-maroon-100'}`}
            >
              {sub.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const CategoryMenu: React.FC<CategoryMenuProps> = ({ isOpen, onClose, onSelectCategory, selectedCategory }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      {/* Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-sm bg-maroon-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-maroon-200">
          <h2 className="font-serif text-2xl font-bold text-maroon-900">Categories</h2>
          <button onClick={onClose} className="p-2 text-maroon-700 hover:text-maroon-950">
            <CloseIcon />
          </button>
        </div>
        <nav className="py-4">
          {CATEGORIES.map(cat => (
            <CategoryMenuItem key={cat.name} category={cat} onSelect={onSelectCategory} selected={selectedCategory} />
          ))}
        </nav>
      </div>
    </>
  );
};

export default CategoryMenu;
