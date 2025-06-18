"use client";
import { clear_cart } from "@/apis_reqests/cart";
import { Cart_form } from "@/components/kosik_cart_items/cart_form";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FormKosik() {
  const route = useRouter();
  const cart = useCart();
  useEffect(() => {
     (async function () {
      cart.refreshCart();
       await clear_cart().then((e) => e);
     })();
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("itemsCount") === "none"
    ) {
      route.push("/kosik");
    }
  }, []);
  return (
    <main className=" text-white  flex-1 mt-[60px]">
      <div className={`flex flex-col`}>
        <div className="mx-auto">
          <div className="flex gap-10 h-[155px] items-start relative ">
            <Link href={"/kosik"}>
              <div className="w-[110px] flex flex-col justify-center items-center gap-2 max-[660px]:w-[90px]">
                <div className="w-[43px] h-[43px] bg-gray-900 text-[35px] flex justify-center items-center  max-[660px]:w-[34px] max-[660px]:h-[34px] max-[660px]:text-[28px]">
                  1
                </div>
                <p className="text-[24px] max-[660px]:text-[18px]">Košík</p>
              </div>
            </Link>
            <Link href={"/kosik/form"}>
              <div className="w-[110px] flex flex-col justify-center items-center gap-2 max-[660px]:w-[90px]">
                <div className="w-[43px] h-[43px] bg-gray-200 text-[35px] flex justify-center items-center text-black max-[660px]:w-[34px] max-[660px]:h-[34px] max-[660px]:text-[28px]">
                  2
                </div>
                <p className="text-[24px] text-center max-[660px]:text-[18px]">
                  Osobní údaje
                </p>
              </div>
            </Link>
            <Link
              href={
                typeof window !== "undefined" && localStorage.getItem("name")
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
      <Cart_form />
    </main>
  );
}