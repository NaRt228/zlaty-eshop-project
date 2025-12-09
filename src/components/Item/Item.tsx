"use client";
import Image from "next/image";
import { post_product } from "@/apis_reqests/products";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

// Define props for each item
export interface ItemProps {
  image: string;
  title: string;
  price: number;
  id?: number;
  description?: string;
  material: string;
  category_id?: number | string;
  stock?: number | string;
  mediaUrls?: string[];
  imageHeight?: number;
  specification: string,
  imageWidth?: number;
}

interface product_curt_post_Interface {
  productId: number;
  quantity: number;
}

const Item = (props: ItemProps) => {
  const imageHeight = props.imageHeight || 350;
  const imageWidth = props.imageWidth || 380;

  const { refreshCart } = useCart();

  const handleBuyClick = async () => {
    if (!props.id) return;

    try {
      const productData: product_curt_post_Interface = {
        productId: props.id,
        quantity: 1,
      };

      const response = await post_product(productData);

      if (response) {
        await refreshCart();
        alert("Produkt byl přidán do košíku!");
      } else {
        alert("Nepodařilo se přidat produkt do košíku.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Došlo k chybě při přidávání produktu do košíku.");
    }
  };

  return (
    <div className="w-fit">
      <div
        className={`relative overflow-hidden w-[${imageHeight}px] h-[${imageHeight}] max-[600px]:w-[320px] max-[600px]:h-[290px]`}
    
      >
        <Link href={`/nakupovat/${props.id}`}><Image
          src={props.image || `/placeholder.svg?height=${imageHeight}&width=${imageWidth} `}
          width={imageWidth}
          height={imageHeight}
          alt={props.title}
          className="transition-transform duration-300 transform hover:scale-110 cursor-pointer object-cover no-drag"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
        /></Link>
      </div>

      <div className="flex justify-between items-start mt-5">
        <div>
          <h2 className="text-[32px] w-[200px] text-white leading-9">
            {props.title}
          </h2>
          <h3 className="text-[20px] leading-5 w-[150px] text-white">
            {props.price} czk
          </h3>
        </div>
        <button
          className="px-[25px] py-[7px] bg-[#ECDFCC] text-[#000] text-[18px] transition-colors duration-300 hover:bg-[#d6c4aa]"
          onClick={handleBuyClick}
        >
          Koupit
        </button>
      </div>
    </div>
  );
};

export default Item;
