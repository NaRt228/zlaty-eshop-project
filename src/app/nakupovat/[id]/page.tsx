"use client";
import { get_product_by_id, post_product } from "@/apis_reqests/products";
import { Get_Once_Product } from "@/interface/product_cart";
import { product_curt_post_Interface } from "@/interface/product_response";
import Image from "next/image";
import playIcon from "../../../../public/free-icon-play-buttton-5577228.png";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { get_categories } from "@/apis_reqests/category";
import Swal from "sweetalert2";

export default function NakupovatItem() {
  const { id } = useParams();
  const [item, setItem] = useState<Get_Once_Product | undefined>(undefined);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [categoryFech, setCategoryFech] = useState<{ name: string; id: number }[] | undefined>(undefined);
  const cart = useCart();

  
  useEffect(() => {
    async function get_item() {
      if (typeof id === "string") {
        const item_get = await get_product_by_id(id);
        setItem(item_get);
        setCurrentImage(item_get?.mediaUrls[0] ?? "");
        const datas = await get_categories();
        setCategoryFech(datas);
      }
    }
    get_item();
  }, [id]);

  async function add_to_cart(productId: number) {
    const productData: product_curt_post_Interface = {
      productId,
      quantity: 1,
    };

    const response = await post_product(productData);

    if (response && (response as any).message) {
      await cart.refreshCart();
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
        timer: 4000
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
  }

  const isVideo = (url: string) => {
    if (!url) return false;
    const ext = url.split(".").pop()?.toLowerCase();
    return ext === "mp4" || ext === "webm" || ext === "ogg";
  };

  return (
    <div className="w-full min-h-screen bg-black text-white pt-32 pb-16 px-4 sm:px-8">
      <main className="max-w-6xl mx-auto">
        {item ? (
          <div className="flex flex-col lg:flex-row gap-12 justify-center items-start">
            {/* Left: Product Images / Media */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <div className="relative aspect-square w-full rounded-none overflow-hidden bg-neutral-900 border border-neutral-800">
                {isVideo(currentImage) ? (
                  <video
                    src={currentImage}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ) : (
                  <Image
                    src={currentImage || "/placeholder.png"}
                    alt={item.name}
                    fill
                    priority
                    sizes="(max-w-1024px) 100vw, 500px"
                    className="object-cover select-none transition-all duration-700"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                )}
              </div>

              {/* Thumbnails Row */}
              {item.mediaUrls && item.mediaUrls.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
                  {item.mediaUrls.map((url, i) => {
                    const isActive = url === currentImage;
                    return (
                      <div
                        key={i}
                        onClick={() => setCurrentImage(url)}
                        className={`relative w-24 aspect-square rounded-none overflow-hidden cursor-pointer bg-neutral-900 border transition-all duration-300 ${
                          isActive
                            ? "border-white scale-[1.03] ring-1 ring-white/50"
                            : "border-neutral-800 opacity-60 hover:opacity-100"
                        }`}
                      >
                        {isVideo(url) ? (
                          <div className="w-full h-full relative">
                            <Image
                              src={playIcon}
                              alt="přehrát video"
                              fill
                              sizes="96px"
                              className="absolute z-10 p-6 object-contain opacity-70"
                            />
                            <video src={url} className="absolute inset-0 w-full h-full object-cover" />
                          </div>
                        ) : (
                          <Image
                            src={url}
                            alt="Detail produktu"
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Product Details & Specs */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between self-stretch gap-8">
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-sm font-light tracking-widest text-neutral-400 uppercase">
                    {categoryFech?.find((e) => e.id === Number.parseInt(item.categoryId))?.name || "Kolekce"}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-light tracking-wide mt-1 text-white">
                    {item.name}
                  </h1>
                </div>

                <p className="text-neutral-300 font-light leading-relaxed text-base md:text-lg border-b border-neutral-900 pb-6">
                  {item.description || "Tento originální autorský šperk nese vlastní příběh a charakter. Vyroben z ušlechtilých kovů s důrazem na každý detail."}
                </p>

                {/* Grid Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-900/30 border border-neutral-900 p-4 rounded-none backdrop-blur-sm">
                    <span className="text-xs text-neutral-400 tracking-wider block mb-1">Materiál</span>
                    <span className="text-base font-light text-white">{item.materials && item.materials.length > 0 ? item.materials.join(", ") : "Ušlechtilý kov"}</span>
                  </div>
                  <div className="bg-neutral-900/30 border border-neutral-900 p-4 rounded-none backdrop-blur-sm">
                    <span className="text-xs text-neutral-400 tracking-wider block mb-1">Hmotnost</span>
                    <span className="text-base font-light text-white">{item.weight ? `${item.weight} g` : "-"}</span>
                  </div>
                  <div className="bg-neutral-900/30 border border-neutral-900 p-4 rounded-none backdrop-blur-sm">
                    <span className="text-xs text-neutral-400 tracking-wider block mb-1">Specifikace</span>
                    <span className="text-base font-light text-white truncate" title={item.specification}>{item.specification || "-"}</span>
                  </div>
                  <div className="bg-neutral-900/30 border border-neutral-900 p-4 rounded-none backdrop-blur-sm">
                    <span className="text-xs text-neutral-400 tracking-wider block mb-1">Skladem</span>
                    <span className="text-base font-light text-white">
                      {item.stock !== undefined && Number(item.stock) === 0 ? "Vyprodáno" : (item.stock ? `${item.stock} ks` : "Na dotaz")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Add To Cart */}
              <div className="bg-neutral-900/20 border border-neutral-900/60 p-6 rounded-none flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
                <div className="text-center sm:text-left">
                  <span className="text-xs text-neutral-400 tracking-wider uppercase block">Cena s DPH</span>
                  <span className="text-2xl md:text-3xl font-light text-white mt- block">
                    {Number(item.price).toLocaleString("cs-CZ")} Kč
                  </span>
                </div>

                {item.stock !== undefined && Number(item.stock) === 0 ? (
                  <button
                    className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 text-neutral-500 border border-neutral-900 font-semibold rounded-none text-base tracking-wider uppercase cursor-not-allowed opacity-50"
                    disabled
                  >
                    Vyprodáno
                  </button>
                ) : (
                  <button
                    onClick={() => add_to_cart(parseInt(item.id))}
                    className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-black text-black hover:text-white border border-white font-semibold rounded-none text-base tracking-wider uppercase transition-all duration-300 hover:shadow-xl hover:shadow-white/5 active:scale-95 cursor-pointer"
                  >
                    Přidat do košíku
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-neutral-400 font-light tracking-wide">
            Načítání detailu produktu...
          </div>
        )}
      </main>
    </div>
  );
}

