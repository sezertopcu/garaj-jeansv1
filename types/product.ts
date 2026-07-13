export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  category: string;
  image: string;
  images?: string[];
  sizes: string[];
  stock: number;
  featured: boolean;
  active: boolean;
  createdAt?: string;
};