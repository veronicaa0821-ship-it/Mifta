
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
