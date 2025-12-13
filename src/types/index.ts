export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
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