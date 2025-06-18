export interface product_curt_post_Interface {
    productId: number;
    quantity: number;
  }
  export interface responde_cart {
    message: string;
    cart: Cart[];
  }
  export interface Cart {
    productId: string;
    quantity: string;
  }
  export interface Item_cart {
    imagePath: string;
    name: string;
    price: number;
    forRemove: {
      productId: number;
      quantity: number;
    }
    
  }