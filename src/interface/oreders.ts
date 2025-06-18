export interface Order {
  guestInfo: GuestInfo;
  cartItems: CartItem[];
}

export interface GuestInfo {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: Address;
}

export interface Address {
  street: string;
  city: string;
  houseNumber: string;
  country: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
}
