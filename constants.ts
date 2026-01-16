
import type { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  {
    name: 'Skincare',
  },
  {
    name: 'Haircare',
    subcategories: [
      { name: 'Shampoo' },
      { name: 'Conditioner' },
      { name: 'Hair Oil' },
    ],
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Hydrating Facial Cleanser',
    price: 24.99,
    imageUrl: 'https://picsum.photos/seed/p1/400/400',
    category: 'Skincare',
    tag: 'Bestseller',
  },
  {
    id: 2,
    name: 'Vitamin C Serum',
    price: 45.0,
    imageUrl: 'https://picsum.photos/seed/p2/400/400',
    category: 'Skincare',
    tag: 'New',
  },
  {
    id: 3,
    name: 'Daily Moisturizer SPF 30',
    price: 32.5,
    imageUrl: 'https://picsum.photos/seed/p3/400/400',
    category: 'Skincare',
  },
  {
    id: 4,
    name: 'Restorative Night Cream',
    price: 55.0,
    imageUrl: 'https://picsum.photos/seed/p4/400/400',
    category: 'Skincare',
  },
  {
    id: 5,
    name: 'Volumizing Shampoo',
    price: 28.0,
    imageUrl: 'https://picsum.photos/seed/p5/400/400',
    category: 'Haircare',
    subcategory: 'Shampoo',
    tag: 'New',
  },
  {
    id: 6,
    name: 'Keratin Smooth Shampoo',
    price: 30.0,
    imageUrl: 'https://picsum.photos/seed/p6/400/400',
    category: 'Haircare',
    subcategory: 'Shampoo',
  },
  {
    id: 13,
    name: 'Glycolic Gloss Shampoo',
    price: 990,
    prices: {
        '440ml': 990,
        '200ml': 500
    },
    imageUrl: 'https://i.imgur.com/n0VRaGV.png',
    category: 'Haircare',
    subcategory: 'Shampoo',
    tag: 'New',
    sizes: ['440ml', '200ml'],
    images: [
      'https://i.imgur.com/n0VRaGV.png',
      'https://i.imgur.com/PzWCPFx.png',
      'https://i.imgur.com/d9QaXvm.png',
      'https://i.imgur.com/GPv367e.png',
      'https://i.imgur.com/R9mYzBf.png'
    ],
    description: 'Loreal Paris Glycolic Gloss Shampoo which makes your hair frizz-free & manageable. Enjoy smooth & glossy hair all day!'
  },
  {
    id: 7,
    name: 'Deep Hydration Conditioner',
    price: 28.0,
    imageUrl: 'https://picsum.photos/seed/p7/400/400',
    category: 'Haircare',
    subcategory: 'Conditioner',
  },
  {
    id: 8,
    name: 'Color Protect Conditioner',
    price: 32.0,
    imageUrl: 'https://picsum.photos/seed/p8/400/400',
    category: 'Haircare',
    subcategory: 'Conditioner',
    tag: 'Bestseller',
  },
  {
    id: 9,
    name: 'Argan Hair Oil',
    price: 35.0,
    imageUrl: 'https://picsum.photos/seed/p9/400/400',
    category: 'Haircare',
    subcategory: 'Hair Oil',
  },
   {
    id: 10,
    name: 'Rosemary Strengthening Oil',
    price: 25.50,
    imageUrl: 'https://picsum.photos/seed/p10/400/400',
    category: 'Haircare',
    subcategory: 'Hair Oil',
  },
  {
    id: 11,
    name: 'Gentle Exfoliating Scrub',
    price: 29.99,
    imageUrl: 'https://picsum.photos/seed/p11/400/400',
    category: 'Skincare',
  },
  {
    id: 12,
    name: 'Anti-Dandruff Shampoo',
    price: 27.0,
    imageUrl: 'https://picsum.photos/seed/p12/400/400',
    category: 'Haircare',
    subcategory: 'Shampoo',
  }
];