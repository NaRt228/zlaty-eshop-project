import DisplayGallery from '../../utils/DisplayGallery';
import GalleryProps, { Products } from '../../utils/interfaces/IFetchGallery'
import axios from 'axios';

async function fetchImages(): Promise<GalleryProps | null> { //získání obráků z API
    const url = "https://apigolde-shop-production-5431.up.railway.app/api/products";

    try { // získání dat z API
        const response = await axios.get<GalleryProps>(url).then((res) => (res.data));
        const filtRes = response.products.filter((product) => product.stock > 0) as Products[];//získání produktů, které nejsou skladem
        console.log(response);
        return {
            ...response,
            products: filtRes
        };
        
        
    }
    catch (error) {
        console.log(error);
        return null;
    }   
}
export default async function Page() {//vykreslení stránky
    const products = await fetchImages();
    if (products===null) {
        return <div>Failed to load images</div>;
    }
    return (
        <>
            {<DisplayGallery products={products} />}
        </>
    );
}