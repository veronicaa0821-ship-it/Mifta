
export interface Product {
  id: number;
  name: string;
  price: number;
  prices?: { [key: string]: number };
  imageUrl: string;
  images?: string[];
  sizes?: string[];
  description?: string;
  category: string;
  subcategory?: string;
  tag?: 'New' | 'Bestseller';
}

export interface Category {
  name: string;
  subcategories?: Category[];
}

export interface User {
  name: string;
  email: string;
}

export interface CartItem {
  id: string; // A unique ID for the cart item, e.g., `${product.id}-${size}`
  product: Product;
  quantity: number;
  size?: string;
}
