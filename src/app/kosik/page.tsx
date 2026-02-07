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
  const [fullPrice, setFullPrice] = useState<number>();
  const { removeCart } = useCart();
  useEffect(() => {
    async function Get_Data() {
      const f = await get_products_cart().then((e) => e);
      setCarItems(f);
      const newItems = f?.filter((e) => e.quantity !== 0);
      console.log(newItems);
      if (newItems?.length === 0 && !newItems) localStorage.setItem("itemsCount", "none");
      else localStorage.setItem("itemsCount", "ok");
      if (f) setFullPrice(getPrice(f));
    }
    
    Get_Data();
  }, []);

   function getPrice(values: Product_cart[]): number {
    let price = 0;
    for (let i = 0; i < values.length; i++) {
      price += values[i].price * values[i].quantity;
    }
    return price;
  }

  async function RemoveItemFromCart(value: product_curt_post_Interface) {
    if (cartItems) {
      const data = [...cartItems];
       
      const g = data?.findIndex(
        (e) => e.id.toString() === value.productId.toString()
      );

      if (g !== -1 && data) {
        value.quantity = data[g].quantity;
        
        data[g].quantity -= 1;
        value.quantity--;
      }
      if(data){
        setCarItems(() => data)

      }
      else{
        setCarItems(() => [])

      }
      setFullPrice(getPrice(data))
    }
    setTimeout(async () => {
      if (value.quantity == 0) {

        await delete_products_cart({ productId: value.productId }).then(() => removeCart());
        
        const newItems = cartItems?.filter((e) => e.quantity !== 0);
        console.log(newItems);
        if(newItems?.length === 0 && !newItems) localStorage.setItem("itemsCount", "none");
        else localStorage.setItem("itemsCount", "ok" );
        setCarItems(newItems);
      } else if (value.quantity >= 1) {
        await put_products_cart(value).then(() => removeCart());
      }
    },1)
    
    
  }

  return (
    <main className=" text-white  flex-1 mt-[60px] font-playfair ">
      <div className={`flex flex-col`}>
      <div className="mx-auto">
        <div className="flex gap-10 h-[155px] items-start relative ">
          <Link href={"/kosik"}>
            <div className="w-[110px] flex flex-col justify-center items-center gap-2 max-[660px]:w-[90px]">
              <div className="w-[43px] h-[43px] bg-gray-200 text-[35px] flex justify-center items-center text-black max-[660px]:w-[34px] max-[660px]:h-[34px] max-[660px]:text-[28px]">
                1
              </div>
              <p className="text-[24px] max-[660px]:text-[18px]">Košík</p>
            </div>
          </Link>
          <Link
            href={
              cartItems?.length !== 0 && cartItems
                ? "/kosik/form"
                : "/nakupovat"
            }
          >
            <div className="w-[110px] flex flex-col justify-center items-center gap-2 max-[660px]:w-[90px]">
              <div className="w-[43px] h-[43px] bg-gray-900 text-[35px] flex justify-center items-center max-[660px]:w-[34px] max-[660px]:h-[34px] max-[660px]:text-[28px]">
                2
              </div>
              <p className="text-[24px] text-center max-[660px]:text-[18px]">
                Osobní údaje
              </p>
            </div>
          </Link>
          <Link
            href={
              cartItems?.length !== 0 &&
              cartItems &&
              localStorage.getItem("name")
                ? "/kosik/podtverzeni"
                : "/nakupovat"
            }
          >
            <div className="w-[110px] flex flex-col justify-center items-center gap-2 max-[660px]:w-[90px]">
              <div className="w-[43px] h-[43px] bg-gray-900 text-[35px] flex justify-center items-center max-[660px]:w-[34px] max-[660px]:h-[34px] max-[660px]:text-[28px]">
                3
              </div>
              <p className="text-[24px] max-[660px]:text-[18px]">Potvrzení</p>
            </div>
          </Link>
          <div className="absolute w-[100px] h-[1px] bg-gray-600 top-6 left-20 max-[660px]:left-16 max-[660px]:w-[92px] max-[660px]:top-5"></div>
          <div className="absolute w-[100px] h-[1px] bg-gray-600 top-6 left-[230px] max-[660px]:top-5 max-[660px]:left-[194px] max-[660px]:w-[92px]"></div>
        </div>
      </div>
      </div>
      <div className="flex justify-between  w-[1350px] max-[1450px]:w-[1130px]   m-auto mt-[5px]  max-[1180px]:flex-col max-[1180px]:w-[660px] max-[1180px]:gap-12 max-[660px]:w-[380px] ">
        <section className="w-[660px] max-[660px]:w-[380px]">
          {cartItems?.length !== 0 && cartItems ? ( 
            cartItems.flatMap((e, index) => 
              Array.from({ length: e.quantity }, (_, i) => (
                
                <div
                  key={`${index}-${i}`}
                  className="flex gap-6 w-[660px] mb-12 max-[660px]:w-[380px]"
                >
                  <Cart_item
                    value={{
                      name: e.name,
                      imagePath: e.mediaUrls[0],
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
            <div>
            {typeof(cartItems) !== "undefined"  ? <h2 className="text-[44px] max-[600px]:text-[30px]">Košík je prázdný...</h2> : <h2 className="text-[44px]">loading...</h2>}
            </div>
          )}
        </section>
        <section className="text-end flex flex-col gap-[10px] max-[660px]:gap-[6px]">
          <h2 className="text-[44px] max-[660px]:text-[30px] max-[1180px]:text-[38px]">
            <b>Celkem: {fullPrice && fullPrice.toString().substring(0, 6)}kč</b>
          </h2>
          <div className="text-[30px] max-[660px]:text-[20px] max-[1180px]:text-[26px]">
            Celkem bez DPH:{" "}
            {fullPrice &&
              (fullPrice - (fullPrice / 100) * 21).toString().substring(0, 8)}
            kč
          </div>{" "}
          {!(cartItems?.length !== 0 && cartItems && getPrice(cartItems) !== 0) ? (
            <button className="py-[10px] px-[25px] w-auto self-start bg-orange-100 text-3xl max-[660px]:text-xl text-black font-bold mt-[20px] ml-auto ">
              <Link href={{ pathname: "/nakupovat", query: {} }}>
                Nakupovat
              </Link>
            </button>
          ) : (
            <button className="py-[10px] px-[25px] w-auto self-start max-[1180px]:text-[26px] bg-orange-100 text-3xl max-[660px]:text-xl text-black font-bold mt-[20px] ml-auto ">
              <Link href={{ pathname: "/kosik/form", query: {} }}>
                Pokračovat
              </Link>
            </button>
          )}
        </section>
      </div>
    </main>
  );
}