"use client";
import { Item_cart, product_curt_post_Interface } from "@/interface/product_response";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export function Cart_item(props: { value: Item_cart, RemoveItemFromCart: (value: product_curt_post_Interface) => Promise<void> }) {
  const [removeItem, setRemoveItem] = useState<product_curt_post_Interface>();

  useEffect(() => {
    setRemoveItem(props.value.forRemove);
  }, [props.value.forRemove]);

  if (props.value && removeItem) {
    return (
      <div className="flex flex-row items-center justify-between w-full gap-4 sm:gap-6">
        {/* Product Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-none overflow-hidden bg-neutral-900 border border-neutral-800">
          <Image
            src={props.value.imagePath || "/placeholder.png"}
            alt={props.value.name}
            fill
            sizes="96px"
            className="object-cover transition-all duration-700"
          />
        </div>

        {/* Product Details & Action */}
        <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-6">
          <div className="text-left">
            <h3 className="text-lg font-light tracking-wide text-white line-clamp-1">
              {props.value.name}
            </h3>
            <span className="text-neutral-300 font-light text-base mt-1 block">
              {props.value.price.toLocaleString("cs-CZ")} Kč
            </span>
          </div>

          <button
            onClick={() => props.RemoveItemFromCart(removeItem)}
            className="px-3.5 py-1.5 border border-white/10 hover:border-white text-neutral-400 hover:text-white hover:bg-neutral-900 text-xs font-semibold tracking-wider uppercase rounded-none transition-all duration-300 cursor-pointer self-end sm:self-center"
          >
            Odebrat
          </button>
        </div>
      </div>
    );
  } else {
    return <div className="text-neutral-500 font-light text-sm">Načítání položky...</div>;
  }
}