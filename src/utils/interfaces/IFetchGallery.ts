export default interface GalleryProps {
    page: number; 
    totalPages: number;
    totalProducts: number;
    products: Products[]; 
}

export interface Products {
    id: number; 
    name: string; 
    description: string;
    price: number; 
    category_id: number;
    stock: number;
    specification: string;
    material: string;
    weight: number; 
    mediaUrls: string[]; 
}

