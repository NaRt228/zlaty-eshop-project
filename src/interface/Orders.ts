export interface Address {
  street: string;
  city: string;
  houseNumber: string;
  country: string;
}

export interface Guest {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: Address;
}

export interface ProductMedia {
  mediaUrls: string[];
}

export interface OrderItem {
  productId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category_id: number | null;
  specification: string | null;
  material: string | null;
  weight: number | null;
  mediaUrls: string[];
}

export interface Order {
  orderId: number;
  total_amount: number;
  status: string;
  
  created_at: string;
  guest: Guest | null;
  items: OrderItem[];
}
