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
    categoryId: number;
    stock: number;
    specification: string;
    materials: string[];
    weight: number; 
    mediaUrls: string[]; 
}

