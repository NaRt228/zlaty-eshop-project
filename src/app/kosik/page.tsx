"use client";
import { useEffect, useState } from "react";
import {
  delete_products_cart,
  get_products_cart,
  put_products_cart,
} from "@/apis_reqests/products";
import { Product_cart } from "@/interface/product_cart";
import { product_curt_post_Interface } from "@/interface/product_response";
import { Cart_item } from "@/components/kosik_cart_items/cart_item";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const [cartItems, setCarItems] = useState<Product_cart[] | undefined>(undefined);
  const [fullPrice, setFullPrice] = useState<number>(0);
  const { removeCart } = useCart();

  useEffect(() => {
    async function Get_Data() {
      const f = await get_products_cart();
      setCarItems(f);
      const newItems = f?.filter((e) => e.quantity !== 0);
      
      if (!newItems || newItems.length === 0) {
        localStorage.setItem("itemsCount", "none");
      } else {
        localStorage.setItem("itemsCount", "ok");
      }
      
      if (f) {
        setFullPrice(getPrice(f));
      }
    }
    
    Get_Data();
  }, []);

  function getPrice(values: Product_cart[]): number {
    return values.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  async function RemoveItemFromCart(value: product_curt_post_Interface) {
    if (cartItems) {
      const data = [...cartItems];
      const g = data.findIndex(
        (e) => e.id.toString() === value.productId.toString()
      );

      if (g !== -1) {
        value.quantity = data[g].quantity;
        data[g].quantity -= 1;
        value.quantity--;
      }
      
      setCarItems(data);
      setFullPrice(getPrice(data));
      
      if (value.quantity === 0) {
        await delete_products_cart({ productId: value.productId }).then(() => removeCart());
        const newItems = data.filter((e) => e.quantity !== 0);
        
        if (!newItems || newItems.length === 0) {
          localStorage.setItem("itemsCount", "none");
        } else {
          localStorage.setItem("itemsCount", "ok");
        }
        setCarItems(newItems);
      } else if (value.quantity >= 1) {
        await put_products_cart(value).then(() => removeCart());
      }
    }
  }

  const hasItems = cartItems && cartItems.length > 0;

  return (
    <div className="w-full min-h-screen bg-black text-white pt-28 pb-16 px-4 sm:px-8 font-light">
      <main className="max-w-6xl mx-auto">
        
        {/* Modern Checkout Steps Timeline */}
        <div className="w-full max-w-xl mx-auto mb-16 px-4">
          <div className="flex justify-between items-center relative">
            
            {/* Step 1: Active */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-10 h-10 rounded-none border border-white bg-white/10 text-white flex justify-center items-center font-medium text-lg shadow-lg shadow-white/5">
                1
              </div>
              <span className="text-sm font-semibold text-white">Košík</span>
            </div>

            {/* Step 2 */}
            <Link href={hasItems ? "/kosik/form" : "/nakupovat"} className="z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-none border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700 flex justify-center items-center font-light text-lg transition-all duration-300">
                  2
                </div>
                <span className="text-sm text-neutral-400 hover:text-white transition-colors duration-300">Údaje</span>
              </div>
            </Link>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2 z-10 select-none">
              <div className="w-10 h-10 rounded-none border border-neutral-800 bg-neutral-900 text-neutral-400 flex justify-center items-center font-light text-lg">
                3
              </div>
              <span className="text-sm text-neutral-500">Potvrzení</span>
            </div>

            {/* Connector Lines */}
            <div className="absolute top-5 left-0 w-full h-[1px] bg-neutral-900 z-0"></div>
          </div>
        </div>

        {/* Cart Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-start mt-8">
          
          {/* Left: Cart Items List */}
          <section className="w-full lg:w-2/3 flex flex-col gap-6">
            {cartItems === undefined ? (
              <div className="text-center py-12 text-neutral-500 font-light">
                Načítání položek košíku...
              </div>
            ) : hasItems ? (
              cartItems.flatMap((e, index) =>
                Array.from({ length: e.quantity }, (_, i) => (
                  <div
                    key={`${index}-${i}`}
                    className="w-full bg-neutral-900/20 border border-neutral-900/60 p-5 rounded-none flex gap-6 items-center backdrop-blur-sm transition-all duration-300 hover:border-neutral-800"
                  >
                    <Cart_item
                      value={{
                        name: e.name,
                        imagePath: e.mediaUrls[0] || "/placeholder.png",
                        price: e.price,
                        forRemove: {
                          quantity: e.quantity,
                          productId: parseInt(e.id),
                        },
                      }}
                      RemoveItemFromCart={RemoveItemFromCart}
                    />
                  </div>
                ))
              )
            ) : (
              <div className="text-center py-16 bg-neutral-900/20 border border-neutral-900/60 rounded-none p-8 flex flex-col items-center gap-6">
                <svg className="w-16 h-16 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <div>
                  <h2 className="text-2xl font-light text-white mb-2">Košík je prázdný</h2>
                  <p className="text-sm text-neutral-500 font-light max-w-sm mx-auto">
                    Vypadá to, že jste si do košíku ještě nic nepřidali. Podívejte se do naší nabídky a vyberte si ten pravý šperk.
                  </p>
                </div>
                <Link href="/nakupovat" className="px-8 py-3.5 bg-white hover:bg-black text-black hover:text-white border border-white rounded-none text-sm font-semibold uppercase tracking-wider transition-all duration-300">
                  Přejít do obchodu
                </Link>
              </div>
            )}
          </section>

          {/* Right: Checkout Price Summary */}
          {hasItems && (
            <section className="w-full lg:w-1/3 bg-neutral-900/30 border border-neutral-900 rounded-none p-6 backdrop-blur-sm flex flex-col gap-6 sticky top-28">
              <h2 className="text-xl font-light tracking-wide text-white border-b border-neutral-900 pb-4">
                Shrnutí objednávky
              </h2>
              
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-neutral-400">
                  <span>Cena bez DPH</span>
                  <span>{(fullPrice - (fullPrice / 100) * 21).toLocaleString("cs-CZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kč</span>
                </div>
                <div className="flex justify-between text-neutral-400 border-b border-neutral-900 pb-4">
                  <span>DPH (21%)</span>
                  <span>{((fullPrice / 100) * 21).toLocaleString("cs-CZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kč</span>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-base text-neutral-300 font-medium">Celkem s DPH</span>
                  <span className="text-2xl font-light text-white">
                    {fullPrice.toLocaleString("cs-CZ")} Kč
                  </span>
                </div>
              </div>

              <Link href="/kosik/form" className="block w-full">
                <button className="w-full py-3.5 bg-white hover:bg-black text-black hover:text-white border border-white font-semibold rounded-none text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-xl hover:shadow-white/5 active:scale-95 cursor-pointer">
                  Pokračovat v objednávce
                </button>
              </Link>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}