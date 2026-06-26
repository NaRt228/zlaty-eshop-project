"use client";
import { useEffect, useState } from 'react';
import DisplayGallery from '../../utils/DisplayGallery';
import GalleryProps from '../../utils/interfaces/IFetchGallery';
import axios from 'axios';

export default function Page() {
  const [productsData, setProductsData] = useState<GalleryProps | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://golde-shop-production.up.railway.app";
      const url = `${baseURL}/api/products`;
      try {
        const response = await axios.get<GalleryProps>(url);
        setProductsData(response.data);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setProductsData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        <p className="text-neutral-400 font-light tracking-wide">Načítání galerie...</p>
      </div>
    );
  }

  if (productsData === null || !productsData || !productsData.products) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
        <div className="text-white text-5xl mb-4">⚠</div>
        <h2 className="text-xl md:text-2xl font-light mb-2">Chyba při načítání galerie</h2>
        <p className="text-neutral-400 font-light text-center max-w-md mb-6">
          Nepodařilo se připojit k serveru. Zkontrolujte prosím své připojení nebo zkuste stránku obnovit.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-white text-black hover:bg-neutral-200 border border-white transition-all duration-300 font-semibold tracking-wider uppercase text-sm"
        >
          Zkusit znovu
        </button>
      </div>
    );
  }

  return <DisplayGallery products={productsData} />;
}