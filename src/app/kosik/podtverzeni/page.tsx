"use client";
import { clear_cart } from "@/apis_reqests/cart";
import { get_products_cart, make_order } from "@/apis_reqests/products";
import emailjs from "@emailjs/browser";
import { useCart } from "@/contexts/CartContext";
import { CartItem, Order } from "@/interface/oreders";
import { Product_cart } from "@/interface/product_cart";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Podtvrzeni() {
  const [cartItems, setCarItems] = useState<Product_cart[] | undefined>([]);
  const [orderProducts, setOrderProducts] = useState<CartItem[]>([]);
  const [fullPrice, setFullPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    secondName: "",
    email: "",
    telefon: "",
    street: "",
    city: "",
    psc: "",
    country: ""
  });

  const cart = useCart();
  const route = useRouter();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("itemsCount") === "none"
    ) {
      route.push("/kosik");
    }

    if (typeof window !== "undefined") {
      setGuestInfo({
        name: localStorage.getItem("name") || "",
        secondName: localStorage.getItem("secondName") || "",
        email: localStorage.getItem("email") || "",
        telefon: localStorage.getItem("telefon") || "",
        street: localStorage.getItem("streat") || "",
        city: localStorage.getItem("sity") || "",
        psc: localStorage.getItem("psc") || "",
        country: localStorage.getItem("county") || "",
      });
    }

    async function Get_Data() {
      const g = await get_products_cart();
      setCarItems(g);
      if (g) {
        const products: CartItem[] = g.map((e) => ({
          productId: parseInt(e.id),
          quantity: e.quantity,
        }));
        setOrderProducts(products);
        setFullPrice(getPrice(g));
      }
      
      const newItems = g?.filter((e) => e.quantity !== 0);
      if (!newItems || newItems.length === 0) {
        localStorage.setItem("itemsCount", "none");
      } else {
        localStorage.setItem("itemsCount", "ok");
      }
    }
    
    Get_Data();

    function getPrice(values: Product_cart[]): number {
      return values.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  }, [route]);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const order: Order = {
        guestInfo: {
          name: guestInfo.name,
          surname: guestInfo.secondName,
          email: guestInfo.email,
          phone: guestInfo.telefon,
          address: {
            city: guestInfo.city,
            street: guestInfo.street,
            country: guestInfo.country,
            houseNumber: guestInfo.psc,
          },
        },
        cartItems: orderProducts,
      };

      const result = await make_order(order);
      if (result !== null) {
        // Send email via EmailJS (fire-and-forget, background execution)
        (async () => {
          try {
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_zlatyeshop";
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_order";
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "user_publicKey";

            const templateParams = {
              order_id: result === "ok" ? "N/A" : result,
              guest_name: `${guestInfo.name} ${guestInfo.secondName}`,
              guest_email: guestInfo.email,
              guest_phone: guestInfo.telefon,
              guest_address: `${guestInfo.street}, ${guestInfo.city}, ${guestInfo.psc}, ${guestInfo.country}`,
              total_price: `${fullPrice.toLocaleString("cs-CZ")} Kč`,
              items_list: cartItems ? cartItems.map(p => `- ${p.name} (množství: ${p.quantity}): ${(p.price * p.quantity).toLocaleString("cs-CZ")} Kč`).join("\n") : ""
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);
            console.log("EmailJS order notification sent successfully");
          } catch (emailErr) {
            console.error("EmailJS sending failed:", emailErr);
          }
        })();

        await clear_cart();
        cart.refreshCart();
        
        // Clear local storage fields
        localStorage.setItem("name", "");
        localStorage.setItem("secondName", "");
        localStorage.setItem("telefon", "");
        localStorage.setItem("email", "");
        localStorage.setItem("psc", "");
        localStorage.setItem("streat", "");
        localStorage.setItem("sity", "");
        localStorage.setItem("county", "");
        localStorage.setItem("itemsCount", "none");
        
        route.push("/");
      }
    } catch (err) {
      console.error("Failed to place order", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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

            {/* Step 2: Inactive (Link to Form) */}
            <Link href="/kosik/form" className="z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-none border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700 flex justify-center items-center font-light text-lg transition-all duration-300">
                  2
                </div>
                <span className="text-sm text-neutral-400 hover:text-white transition-colors duration-300">Údaje</span>
              </div>
            </Link>

            {/* Step 3: Active */}
            <div className="flex flex-col items-center gap-2 z-10 select-none">
              <div className="w-10 h-10 rounded-none border border-white bg-black text-white flex justify-center items-center font-medium text-lg shadow-lg shadow-white/5">
                3
              </div>
              <span className="text-sm font-semibold text-white">Potvrzení</span>
            </div>

            {/* Connector Lines */}
            <div className="absolute top-5 left-8 right-8 h-[1px] bg-neutral-900 z-0"></div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row gap-12 mt-8">
          
          {/* Left Panel: Reviewing personal & billing details */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            
            {/* Personal details */}
            <div className="bg-neutral-900/20 border border-neutral-900 p-6 rounded-none flex flex-col gap-6">
              <h2 className="text-lg font-light tracking-wide text-white border-b border-neutral-900/60 pb-3 uppercase">
                Osobní údaje
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1">Jméno a příjmení</span>
                  <span className="text-white text-base font-light">
                    {guestInfo.name} {guestInfo.secondName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1">Telefon</span>
                  <span className="text-white text-base font-light">{guestInfo.telefon}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1">E-mailová adresa</span>
                  <span className="text-white text-base font-light">{guestInfo.email}</span>
                </div>
              </div>
            </div>

            {/* Billing address details */}
            <div className="bg-neutral-900/20 border border-neutral-900 p-6 rounded-none flex flex-col gap-6">
              <h2 className="text-lg font-light tracking-wide text-white border-b border-neutral-900/60 pb-3 uppercase">
                Fakturační adresa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1">Ulice a číslo popisné</span>
                  <span className="text-white text-base font-light">{guestInfo.street}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1">Město</span>
                  <span className="text-white text-base font-light">{guestInfo.city}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1">PSČ</span>
                  <span className="text-white text-base font-light">{guestInfo.psc}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1">Země</span>
                  <span className="text-white text-base font-light">{guestInfo.country}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel: Order items summary & final price */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-neutral-900/20 border border-neutral-900 p-6 rounded-none flex flex-col gap-6">
              <h2 className="text-lg font-light tracking-wide text-white border-b border-neutral-900/60 pb-3 uppercase">
                Shrnutí objednávky
              </h2>
              
              {/* Product items */}
              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 border-b border-neutral-900/60 pb-6">
                {cartItems && cartItems.length > 0 ? (
                  cartItems.flatMap((e, index) =>
                    Array.from({ length: e.quantity }, (_, i) => (
                      <div key={`${index}-${i}`} className="flex gap-4 items-center">
                        <div className="relative w-16 h-16 bg-neutral-950 border border-neutral-900 flex-shrink-0">
                          {e.mediaUrls && e.mediaUrls[0] ? (
                            <Image
                              src={e.mediaUrls[0]}
                              alt={e.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-light text-white truncate">{e.name}</h3>
                          <span className="text-xs text-neutral-500">1 ks</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm font-light text-white font-medium">
                            {e.price.toLocaleString("cs-CZ")} Kč
                          </span>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  <div className="text-center py-6 text-neutral-600 text-sm">
                    Žádné položky v košíku
                  </div>
                )}
              </div>

              {/* Total prices */}
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-neutral-400">
                  <span>Bez DPH</span>
                  <span>
                    {((fullPrice - (fullPrice / 100) * 21)).toLocaleString("cs-CZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kč
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400 border-b border-neutral-900/60 pb-4">
                  <span>DPH (21%)</span>
                  <span>
                    {(((fullPrice / 100) * 21)).toLocaleString("cs-CZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kč
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-base text-neutral-300 font-medium">Celkem s DPH</span>
                  <span className="text-2xl font-light text-white">
                    {fullPrice.toLocaleString("cs-CZ")} Kč
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || !cartItems || cartItems.length === 0}
                className={`w-full py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 border rounded-none cursor-pointer ${
                  isSubmitting
                    ? "bg-neutral-800 border-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-white border-white text-black hover:bg-black hover:text-white hover:shadow-xl hover:shadow-white/5 active:scale-95"
                }`}
              >
                {isSubmitting ? "Odesílání..." : "Odeslat objednávku"}
              </button>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
