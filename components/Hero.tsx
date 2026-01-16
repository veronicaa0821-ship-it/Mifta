
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-maroon-800">
      <div className="absolute inset-0">
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2572&auto=format&fit=crop"
          alt="Aesthetic beauty products"
        />
        <div className="absolute inset-0 bg-maroon-950/50 mix-blend-multiply" aria-hidden="true" />
      </div>
      <div className="relative mx-auto max-w-4xl py-24 px-4 text-center sm:py-32 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Embrace Your Radiance
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-maroon-100">
          Discover our curated collection of luxury skincare and haircare, crafted to unveil your natural beauty.
        </p>
        <div className="mt-12">
          <a
            href="#"
            className="inline-block rounded-md border border-transparent bg-white py-3 px-8 text-base font-semibold text-maroon-800 hover:bg-maroon-100 transition-colors"
          >
            Shop Collection
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
