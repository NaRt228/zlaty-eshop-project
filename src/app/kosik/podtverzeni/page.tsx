"use client";
import { clear_cart } from "@/apis_reqests/cart";
import { get_products_cart, make_order } from "@/apis_reqests/products";
import { useCart } from "@/contexts/CartContext";
import { CartItem, Order } from "@/interface/oreders";
import { Product_cart } from "@/interface/product_cart";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const counter = false;
export default function Podtvrzeni() {
  const [cartItems, setCarItems] = useState<Product_cart[] | undefined>([]);
  const [orderProducts, setOrderProducts] = useState<CartItem[]>([]);
    const [fullPrice, setFullPrice] = useState<number>();
  const cart = useCart();
  const route = useRouter();
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("itemsCount") === "none"
    ) {
      route.push("/kosik");
    }
    async function Get_Data() {
      //await post_product({ productId: 2, quantity: 6}).then(e => alert(e?.message));
      const g = await get_products_cart().then((e) => e);
      setCarItems(g);
      if(g){
        const products : CartItem[] = g?.map(e => ({productId: parseInt(e.id), quantity: e.quantity}));
        setOrderProducts(products)
      }
       const f = await get_products_cart().then((e) => e);
      setCarItems(f);
      const newItems = f?.filter((e) => e.quantity !== 0);
      console.log(newItems);
      if (newItems?.length === 0 && !newItems) localStorage.setItem("itemsCount", "none");
      else localStorage.setItem("itemsCount", "ok");
      if (f) setFullPrice(getPrice(f));
    }
    Get_Data();
    function getPrice(values: Product_cart[]): number {
    let price = 0;
    for (let i = 0; i < values.length; i++) {
      price += values[i].price * values[i].quantity;
    }
    return price;
  }
  }, []);
  // function getPrice(values: Product_cart[]): number {
  //   let price = 0;
  //   for (let i = 0; i < values.length; i++) {
  //     price += values[i].price * values[i].quantity;
  //   }
  //   return price;
  // }
  return (
    <main className="text-white  flex-1 mt-[60px] mb-24 ">
      {!counter ? (
        <div className="flex justify-center flex-col">
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
                  <div className="w-[43px] h-[43px] bg-gray-900 text-[35px] flex justify-center items-center max-[660px]:w-[34px] max-[660px]:h-[34px] max-[660px]:text-[28px]">
                    2
                  </div>
                  <p className="text-[24px] text-center max-[660px]:text-[18px]">
                    Osobní údaje
                  </p>
                </div>
              </Link>
              <Link href={"/kosik/podtverzeni"}>
                <div className="w-[110px] flex flex-col justify-center items-center gap-2 max-[660px]:w-[90px]">
                  <div className="w-[43px] h-[43px] bg-gray-200 text-[35px] flex justify-center items-center text-black max-[660px]:w-[34px] max-[660px]:h-[34px] max-[660px]:text-[28px]">
                    3
                  </div>
                  <p className="text-[24px] max-[660px]:text-[18px]">
                    Potvrzení
                  </p>
                </div>
              </Link>
              <div className="absolute w-[100px] h-[1px] bg-gray-600 top-6 left-20 max-[660px]:left-16 max-[660px]:w-[92px] max-[660px]:top-5"></div>
              <div className="absolute w-[100px] h-[1px] bg-gray-600 top-6 left-[230px] max-[660px]:top-5 max-[660px]:left-[194px] max-[660px]:w-[92px]"></div>
            </div>
          </div>
          <div className="flex gap-[200px] mt-[5px] max-[1330px]:flex-col max-[1330px]:gap-[80px] max-[660px]:gap-[70px] mx-auto">
            <section className="w-[550px] flex flex-col gap-6 max-[660px]:w-[380px] ml-[10px]">
              <div className="text-[32px] flex flex-col gap-2 max-[660px]:text-[24px]">
                <h2 className="text-[36px] text-white text-opacity-75 max-[660px]:text-[28px]">
                  Fakturační adresa
                </h2>
                <div className="flex justify-between ml-3">
                  <p>Ulice:</p>{" "}
                  <p className="w-[250px]">
                    {typeof window !== "undefined" &&
                      localStorage.getItem("streat")}
                  </p>
                </div>
                <div className="flex justify-between ml-3">
                  <p>Město:</p>{" "}
                  <p className="w-[250px]">
                    {typeof window !== "undefined" &&
                      localStorage.getItem("sity")}
                  </p>
                </div>
                <div className="flex justify-between ml-3">
                  <p>Číslo popisné:</p>{" "}
                  <p className="w-[250px]">
                    {typeof window !== "undefined" &&
                      localStorage.getItem("psc")}
                  </p>
                </div>
                <div className="flex justify-between ml-3">
                  <p>Země:</p>{" "}
                  <p className="w-[250px]">
                    {typeof window !== "undefined" &&
                      localStorage.getItem("county")}
                  </p>
                </div>
              </div>
              <div className="text-[32px] flex flex-col gap-2 max-[660px]:text-[24px] ">
                <h2 className="text-[36px] text-white text-opacity-75 max-[660px]:text-[28px]">
                  Osobní údaje
                </h2>
                <div className="flex justify-between ml-3">
                  <p>Jméno:</p>{" "}
                  <p className="w-[250px]">
                    {typeof window !== "undefined" &&
                      localStorage.getItem("name")}
                  </p>
                </div>
                <div className="flex justify-between ml-3">
                  <p>Příjmení:</p>{" "}
                  <p className="w-[250px]">
                    {typeof window !== "undefined" &&
                      localStorage.getItem("secondName")}
                  </p>
                </div>
                <div className="flex justify-between ml-3">
                  <p>Email:</p>{" "}
                  <p className="w-[250px] text-[22px] mt-[12px] max-[660px]:mt-[6px] max-[660px]:text-[18px]">
                    {typeof window !== "undefined" &&
                      localStorage.getItem("email")}
                  </p>
                </div>
                <div className="flex justify-between ml-3">
                  <p>Číslo:</p>{" "}
                  <p className="w-[250px]">
                    {typeof window !== "undefined" &&
                      localStorage.getItem("telefon")}
                  </p>
                </div>
              </div>
            </section>
            <div className="max-[660px]:w-[80%]  max-[660px]:h-[1px] max-[660px]:bg-gray-100 max-[660px]:m-auto"></div>
            <section className="flex flex-col w-[550px] max-[660px]:w-[360px] max-[660px]:mx-auto ">
              {cartItems &&
                cartItems.flatMap((e, index) =>
                  Array.from({ length: e.quantity }, (_, i) => (
                    <div
                      key={`${index}-${i}`}
                      className="flex gap-6 w-[550px] mb-12 max-[660px]:w-[380px]"
                    >
                      <div className="relative w-[132px] h-[132px] overflow-hidden max-[660px]:w-[150px] max-[660px]:h-[100px]">
                        <Image
                          src={e.mediaUrls[0]}
                          alt="product"
                          fill
                          objectFit="cover"
                        />
                      </div>

                      <div className="text-start flex flex-col justify-between w-[390px] ">
                        <div className="max-[660px]:flex max-[660px]:flex-col max-[660px]:gap-1 max-[660px]:-translate-y-3">
                          <h2 className="text-[60px] max-[660px]:text-[36px] ">
                            {e.name}
                          </h2>
                          <p className="text-[35px] max-[660px]:text-[30px]">
                            {e.price}
                          </p>
                        </div>
                        <div className="flex justify-end "></div>
                      </div>
                    </div>
                  ))
                )}
                 <h2 className="text-[44px] max-[660px]:text-[30px] max-[1180px]:text-[38px] text-right">
            <b>Celkem: {fullPrice && fullPrice.toString().substring(0, 6)}kč</b>
          </h2>
          <div className="text-[30px] max-[660px]:text-[20px] max-[1180px]:text-[26px] mb-10 text-right">
            Celkem bez DPH:{" "}
            {fullPrice &&
              (fullPrice - (fullPrice / 100) * 21).toString().substring(0, 8)}
            kč
          </div>
              <button className="py-[10px] px-[25px] w-auto self-start bg-orange-100 text-3xl max-[660px]:text-xl text-black font-bold ml-auto mt-auto cursor-pointer">
                <button
                  onClick={() => {
                    (async function () {
                      const order: Order = {
                        guestInfo: {
                          name:  localStorage.getItem("name") ?? "",
                          surname: localStorage.getItem("secondName") ?? "",
                          email: localStorage.getItem("email") ?? "",
                          phone: localStorage.getItem("telefon") ?? "",
                          address: {
                            city: localStorage.getItem("sity") ?? "",
                            street: localStorage.getItem("streat") ?? "",
                            country: localStorage.getItem("county") ?? "",
                            houseNumber: localStorage.getItem("psc") ?? "",
                          },
                        },
                        cartItems: orderProducts,
                      };
                      console.log("1234");
                      await make_order(order).then((e) => {
                        if (e == "ok") {
                          (async function () {
                            await clear_cart().then(cart.refreshCart);
                          })();
                          route.push("/");
                          localStorage.setItem("name", "");
                          localStorage.setItem("secondName", "");
                          localStorage.setItem("telefon", "");
                          localStorage.setItem("email", "");
                          localStorage.setItem("psc", "");
                          localStorage.setItem("streat", "");
                          localStorage.setItem("sity", "");
                          localStorage.setItem("county", "");
                        }
                      });
                     
                    })();
                  }}
                >
                  Poslat objednavku
                </button>
              </button>
            </section>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
}
