"use client";
import { Item_cart, product_curt_post_Interface } from "@/interface/product_response";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export function Cart_item(props: { value: Item_cart, RemoveItemFromCart: (value: product_curt_post_Interface) => Promise<void> }) {
  
  const [removeItem, setRemoveItem] = useState<product_curt_post_Interface>();
  useEffect(() => {
    setRemoveItem(props.value.forRemove)
  }, []);
  if (props.value && removeItem) {
    return (
        <>
          <div className="relative w-[265px] h-[300px] rounded overflow-hidden max-[660px]:w-[150px] max-[660px]:h-[150px] max-[1180px]:w-[170px] max-[1180px]:h-[200px]">
            <Image
              src={props.value.imagePath}
              alt="product"
              fill
              objectFit="cover"
            />
          </div>
    
          <div className="text-start flex flex-col justify-between w-[390px] ">
            <div className="max-[660px]:flex max-[660px]:flex-col max-[660px]:gap-1 max-[660px]:-translate-y-3">
              <h2 className="text-[42px] max-[660px]:text-[32px] max-[1180px]:text-[37px]">{props.value.name}</h2>
              <p className="text-[30px] max-[660px]:text-[24px] max-[1180px]:text-[26px]">{props.value.price}</p>
            </div>
            <div className="flex justify-end ">
            <button
                onClick={() => {props.RemoveItemFromCart(removeItem) }}
                className="text-[30px] text-zinc-100 text-opacity-50 max-[660px]:text-[20px] max-[660px]:-translate-y-7 max-[1180px]:text-[26px] border border-zinc-100 border-opacity-30 px-4 py-1 rounded-md hover:bg-zinc-800 hover:text-opacity-70 transition-all"
              >
                Odebrat
              </button>
            </div>
          </div>
        </>

  
 
  );
}
else{
    return <>Loging...</>
}
}