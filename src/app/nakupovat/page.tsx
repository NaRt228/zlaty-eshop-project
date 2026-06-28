"use client";
import Filter from "@/components/Filter/Filter";
import type { ItemProps } from "@/components/Item/Item";
import Item from "@/components/Item/Item";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@/components/Pagination/Pagination";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  categoryId: number;
  stock: number;
  created_at: string;
  image_url: string | null;
  likes: number;
  specification: string;
  material: string;
  weight: string;
  media_urls: string | null;
  mediaUrls?: string[];
}

interface ProductsResponse {
  page: number;
  totalPages: number;
  totalProducts: number;
  products: Product[];
}

const Page = () => {
  const [isModal, setIsModal] = useState<boolean>(false);
  const [products, setProducts] = useState<ItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [separatedData, setSeparatedData] = useState<ItemProps[][]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://golde-shop-production.up.railway.app";
        const response = await axios.get<ProductsResponse>(
          `${baseURL}/api/products?page=${currentPage}`,
          { withCredentials: true }
        );

        const formattedProducts: ItemProps[] = response.data.products.map((product) => ({
          image: product.mediaUrls?.[0] || "/placeholder.png",
          title: product.name,
          price: Number.parseFloat(product.price),
          id: product.id,
          description: product.description,
          category_id: product.categoryId,
          materials: (product as any).materials || [],
          materialId: (product as any).materialId ?? undefined,
          stock: product.stock,
          specification: product.specification,
          mediaUrls: product.mediaUrls || [],
        }));

        setProducts(formattedProducts);
        setSeparatedData(chunkArray(formattedProducts, 3));
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Nepodařilo se načíst produkty. Zkuste to prosím později.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const onClickModal = () => {
    setIsModal(!isModal);
  };

  const chunkArray = (arr: ItemProps[], size: number) => {
    return arr.reduce((chunks, item, i) => {
      if (i % size === 0) chunks.push([]);
      chunks[chunks.length - 1].push(item);
      return chunks;
    }, [] as ItemProps[][]);
  };
  
  return (
    <div className="w-full min-h-screen bg-black text-white pt-28 pb-16 px-4 sm:px-8">
      {/* Page Title */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
          Nakupovat
        </h1>
        <div className="w-20 h-[1px] bg-neutral-500 mx-auto"></div>
      </div>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start mt-6">
        
        {/* Filter Sidebar (collapsible on mobile, visible on desktop) */}
        <div className="w-full lg:w-[280px] shrink-0 relative z-20">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden mb-4">
            <button
              className="flex items-center gap-2 bg-white border border-white hover:bg-black hover:text-white text-black px-5 py-2.5 rounded-none text-sm font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer"
              onClick={onClickModal}
            >
              <svg className="w-4 h-4 currentColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filtry
            </button>
          </div>

          {/* Filter Container */}
          <div className={`${isModal ? "block" : "hidden"} lg:block`}>
            <Filter 
              product={products} 
              separated={separatedData} 
              setSeparated={setSeparatedData} 
              chunkArray={chunkArray}
            />
          </div>
        </div>

        {/* Product Display Container */}
        <div className="flex-1 w-full">
          {loading ? (
            <div className="text-center py-20 text-neutral-400 font-light tracking-wide">
              Načítání produktů...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-400 font-light tracking-wide">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-neutral-500 font-light tracking-wide">
              Žádné produkty k zobrazení
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {separatedData.flatMap(chunk => chunk)
                  .filter((item) => item.stock !== 0)
                  .map((item, index) => (
                    <Item 
                      key={index} 
                      specification={item.specification} 
                      materials={item.materials} 
                      image={item.image} 
                      price={item.price} 
                      title={item.title} 
                      id={item.id} 
                      stock={item.stock}
                    />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="mt-12 flex justify-center">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={setCurrentPage} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
