"use client";
import Image from "next/image";
import { post_product } from "@/apis_reqests/products";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import Swal from "sweetalert2";

export interface ItemProps {
  image: string;
  title: string;
  price: number;
  id?: number;
  description?: string;
  materials: string[];
  materialId?: number;
  category_id?: number | string;
  stock?: number | string;
  mediaUrls?: string[];
  imageHeight?: number;
  specification: string;
  imageWidth?: number;
}

interface product_curt_post_Interface {
  productId: number;
  quantity: number;
}

const Item = (props: ItemProps) => {
  const { refreshCart } = useCart();

  const handleBuyClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!props.id) return;

    try {
      const productData: product_curt_post_Interface = {
        productId: props.id,
        quantity: 1,
      };

      const response = await post_product(productData);

      if (response && response.message) {
        await refreshCart();

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Produkt byl přidán do košíku",
          background: "#0a0a0a",
          color: "#e5e5e5",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        });
      } else if (response && (response as any).error) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: (response as any).error,
          background: "#0a0a0a",
          color: "#e5e5e5",
          showConfirmButton: false,
          timer: 3500
        });
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Nepodařilo se přidat produkt",
          background: "#0a0a0a",
          color: "#e5e5e5",
          showConfirmButton: false,
          timer: 3000
        });
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div className="relative group w-[300px] sm:w-[320px] mb-4">
      {/* Structural Offset Shadow Border (Homepage wireframe style) */}
      <div className="absolute inset-0 border border-white/10 translate-x-3 translate-y-3 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4 group-hover:border-white/30 z-0"></div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full bg-black border border-white/20 overflow-hidden flex flex-col justify-between transition-all duration-500 group-hover:border-white/40 group-hover:-translate-y-1">
        {/* Product Image Link */}
        <Link href={`/nakupovat/${props.id}`} className="block relative aspect-square w-full overflow-hidden bg-black">
          <Image
            src={props.image || "/placeholder.png"}
            alt={props.title}
            fill
            sizes="(max-w-768px) 100vw, 320px"
            draggable={false}
            className="object-cover transition-all duration-700 group-hover:scale-105 select-none"
          />
        </Link>

        {/* Product Details */}
        <div className="p-5 flex flex-col gap-4 flex-1 justify-between bg-black">
          <div>
            <Link href={`/nakupovat/${props.id}`}>
              <h2 className="text-xl font-light tracking-wide text-white hover:text-neutral-300 transition-colors duration-300 line-clamp-1 mb-1">
                {props.title}
              </h2>
            </Link>
            <span className="text-sm font-light text-neutral-400">
              {props.materials && props.materials.length > 0 ? props.materials.join(", ") : ""}
            </span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-lg font-light text-white">
              {props.price.toLocaleString("cs-CZ")} Kč
            </span>
            {props.stock !== undefined && Number(props.stock) === 0 ? (
              <button
                className="px-4 py-2 bg-neutral-900 text-neutral-500 border border-neutral-900 rounded-none text-sm font-semibold tracking-wider uppercase cursor-not-allowed opacity-50"
                disabled
              >
                Vyprodáno
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-white text-black border border-white rounded-none text-sm font-semibold tracking-wider uppercase hover:bg-black hover:text-white active:scale-95 transition-all duration-300 cursor-pointer"
                onClick={handleBuyClick}
              >
                Koupit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
