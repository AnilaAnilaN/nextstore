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
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    email?: string;
  };
  image: string;
  imageId?: string;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: {
    product: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
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
