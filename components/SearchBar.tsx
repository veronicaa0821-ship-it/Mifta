
import React from 'react';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-maroon-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-maroon-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);


interface SearchBarProps {
    isOpen: boolean;
    onClose: () => void;
    onImageSearchClick: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose, onImageSearchClick }) => {
    return (
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-maroon-50/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`relative max-w-xl mx-auto mt-20 p-4 transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
                <div className="flex justify-end">
                    <button onClick={onClose} className="p-2 text-maroon-800 hover:text-maroon-950">
                        <CloseIcon />
                    </button>
                </div>
                <div className="relative mt-4">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <SearchIcon />
                    </div>
                    <input
                        type="search"
                        name="search"
                        id="search"
                        className="block w-full rounded-md border-0 bg-white py-4 pl-12 pr-12 text-maroon-900 shadow-lg ring-1 ring-inset ring-maroon-200 placeholder:text-maroon-400 focus:ring-2 focus:ring-inset focus:ring-maroon-700 sm:text-lg sm:leading-6"
                        placeholder="Search for products..."
                        autoFocus
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button onClick={onImageSearchClick} className="p-2 text-maroon-800 hover:text-maroon-950 rounded-full hover:bg-maroon-100 transition-colors">
                           <span className="sr-only">Search by image</span>
                           <CameraIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
