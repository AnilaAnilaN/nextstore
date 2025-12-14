export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageId?: string;
  category: 'clothing' | 'shoes' | 'accessories';
  sizes?: string[];
  colors?: string[];
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  description: string;
}

export interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}
