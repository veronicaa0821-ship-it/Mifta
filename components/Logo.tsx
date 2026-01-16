
import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 150 30" 
    xmlns="http://www.w3.org/2000/svg" 
    aria-label="Zephyra Logo"
    {...props}
  >
    <defs>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        `}
      </style>
    </defs>
    <text 
      x="0" 
      y="24" 
      fontFamily="'Playfair Display', serif" 
      fontSize="30" 
      fontWeight="700" 
      fill="currentColor"
      letterSpacing="2"
    >
      ZEPHYRA
    </text>
  </svg>
);
