"use client"
import { useEffect, useState } from 'react';
import DisplayGallery from '../../utils/DisplayGallery';
import GalleryProps from '../../utils/interfaces/IFetchGallery';
import axios from 'axios';

async function fetchImages(): Promise<GalleryProps | null> {
  const url = "https://apigolde-shop-production-5431.up.railway.app/api/products";
  console.log("qwerewerewq");
  try {
    const response = await axios.get<GalleryProps>(url);
    const filteredProducts = response.data.products.filter(product => product.stock > 0);

    return {
      ...response.data,
      products: filteredProducts,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function Page() {
    const [productsData, setProductsData] = useState<any>();
    useEffect(() => {
        (async function(){
            setProductsData(await fetchImages().then(e => e));
        })()
    })

  if (!productsData) {
    return <div>Failed to load images</div>;
  }

  return (
    <>
      <DisplayGallery  products={productsData}  />
    </>
  );
}