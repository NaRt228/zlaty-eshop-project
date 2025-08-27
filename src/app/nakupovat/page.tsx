"use client"

import Filter from "@/components/Filter/Filter"
import type { ItemProps } from "@/components/Item/Item"
import Item from "@/components/Item/Item"
import { useEffect, useState } from "react"
import axios from "axios"
import Pagination from "@/components/Pagination/Pagination"
interface Product {
  id: number
  name: string
  description: string
  price: string
  category_id: number
  stock: number
  created_at: string
  image_url: string | null
  likes: number
  specification: string
  material: string
  weight: string
  media_urls: string | null
  mediaUrls?: string[]
}

interface ProductsResponse {
  page: number
  totalPages: number
  totalProducts: number
  products: Product[]
}

const Page = () => {
  const [isModal, setIsModal] = useState<boolean>(false)
  const [products, setProducts] = useState<ItemProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [separatedData, setSeparatedData] = useState<ItemProps[][]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get<ProductsResponse>(
          `https://apigolde-shop-production-5431.up.railway.app/api/products?page=${currentPage}`,
          { withCredentials: true },
        )

       
        const formattedProducts: ItemProps[] = response.data.products.map((product) => ({
          image: product.mediaUrls?.[0] || "/placeholder.svg?height=200&width=300",
          title: product.name,
          price: Number.parseFloat(product.price),
          id: product.id,
          description: product.description,
          category_id: product.category_id,
          
          material: product.material,
          stock: product.stock,
          specification: product.specification,
          mediaUrls: product.mediaUrls || [],
        }))

        setProducts(formattedProducts)
        setSeparatedData(chunkArray(formattedProducts, 3));
        setTotalPages(response.data.totalPages)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch products:", err)
        setError("Nepodařilo se načíst produkty. Zkuste to prosím později.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage]) // Re-fetch when currentPage changes

  const onClickModal = () => {
    setIsModal(!isModal)
  }

  const chunkArray = (arr: ItemProps[], size: number) => {
    return arr.reduce((chunks, item, i) => {
      if (i % size === 0) chunks.push([])
      chunks[chunks.length - 1].push(item)
      return chunks
    }, [] as ItemProps[][])
  }
  
  return (
    <>
      <h1 className="text-6xl text-white mt-12 text-center mb-10 max-[600px]:text-[48px]">Nakupovat</h1>
      <div className="sticky top-3 z-20">
    <button
        className=" bg-[#ECDFCC] w-fit px-4 py-3 z-30 max-[600px]:text-[16px] ab text-black   font-bold text-[20px] transition duration-300 hover:bg-[#d9c4a8] hover:scale-105"
        onClick={onClickModal}
        >
        Filtry
        
      </button>
      
      {isModal ? <Filter product={products} separated={separatedData} setSeparated={setSeparatedData} chunkArray={chunkArray}/> : <></>}
      
      </div>
  
      <div className="flex flex-col justify-center items-center px-6 mt-4">
        {loading ? (
          <div className="mt-10 text-white text-xl">Načítání produktů...</div>
        ) : error ? (
          <div className="mt-10 text-red-500 text-xl">{error}</div>
        ) : products.length === 0 ? (
          <div className="mt-10 text-white text-xl">Žádné produkty k zobrazení</div>
        ) : (
          <>
            <div className="flex flex-col gap-[30px]">
              {separatedData.map((chunk, index) => (
                <div key={index} className="flex gap-[70px] flex-wrap justify-center">
                  {chunk.map((item, itemIndex) => (
                    <Item key={itemIndex} specification={item.specification} material={item.material} image={item.image} price={item.price} title={item.title} id={item.id} />
                  ))}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </div>
    </>
  )
}

export default Page
