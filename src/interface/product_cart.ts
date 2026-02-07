export interface Product_cart {
    id: string
    name: string
    description: string
    price: number,
    category_id: string
    stock: string
    quantity: number,
    mediaUrls: string[]
}

export interface Get_Once_Product {
    id: string
    name: string
    description: string
    price: string
    categoryId: string
    stock: string
    specification: string
    material: string
    weight: string
    mediaUrls: string[]
  }