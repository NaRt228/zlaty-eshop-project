"use client";
import { Cart_form } from "@/components/kosik_cart_items/cart_form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FormKosik() {
  const route = useRouter();
  
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("itemsCount") === "none"
    ) {
      route.push("/kosik");
    }
  }, [route]);

  return (
    <div className="w-full min-h-screen bg-black text-white pt-28 pb-16 px-4 sm:px-8 font-light">
      <main className="max-w-6xl mx-auto">
        
        {/* Modern Checkout Steps Timeline */}
        <div className="w-full max-w-xl mx-auto mb-16 px-4">
          <div className="flex justify-between items-center relative">
            
            {/* Step 1: Inactive (Link to Cart) */}
            <Link href="/kosik" className="z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-none border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700 flex justify-center items-center font-light text-lg transition-all duration-300">
                  1
                </div>
                <span className="text-sm text-neutral-400 hover:text-white transition-colors duration-300">Košík</span>
              </div>
            </Link>

            {/* Step 2: Active */}
            <div className="flex flex-col items-center gap-2 z-10 select-none">
              <div className="w-10 h-10 rounded-none border border-white bg-black text-white flex justify-center items-center font-medium text-lg shadow-lg shadow-white/5">
                2
              </div>
              <span className="text-sm font-semibold text-white">Údaje</span>
            </div>

            {/* Step 3: Inactive */}
            <div className="flex flex-col items-center gap-2 z-10 select-none opacity-50">
              <div className="w-10 h-10 rounded-none border border-neutral-800 bg-neutral-900 text-neutral-400 flex justify-center items-center font-light text-lg">
                3
              </div>
              <span className="text-sm text-neutral-500">Potvrzení</span>
            </div>

            {/* Connector Lines */}
            <div className="absolute top-5 left-8 right-8 h-[1px] bg-neutral-900 z-0"></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="mt-8">
          <Cart_form />
        </div>
      </main>
    </div>
  );
}