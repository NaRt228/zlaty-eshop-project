"use client"
import { get_product_by_id, post_product } from "@/apis_reqests/products";
import { Get_Once_Product } from "@/interface/product_cart";
import { product_curt_post_Interface } from "@/interface/product_response";
import Image from "next/image";
import IMG from "../../../../public/free-icon-play-buttton-5577228.png"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
export default function NakupovatItem(){
    const { id } = useParams();
    const [item , setItem] = useState<Get_Once_Product | undefined>(undefined);
    const [currentImage, setCurrentImage] = useState<string>("");
    const cart = useCart();
    useEffect(() => {
      async function get_item(){
        if(typeof(id) === "string"){
            const item_get = await get_product_by_id(id);
            setItem(() => item_get)
            console.log(item_get?.mediaUrls);
            setCurrentImage(item_get?.mediaUrls[0] ?? "");
        };
      };
      get_item();
    }, [])
    async function add_to_cart(id: number) {
      const productData: product_curt_post_Interface = {
        productId: id,
        quantity: 1,
      };

      const response = await post_product(productData);
      await cart.refreshCart();
      if (!response) {
        alert("Nepodařilo se přidat produkt do košíku.");
      }
    }
    return (
      <main className="mt-[200px] max-[1000px]:mb-[100px] flex flex-col justify-center items-center max-[1335px]:mt-[100px]">
        {item ? (
          <div className="flex gap-[20px] justify-center flex-wrap rounded-sm w-[100%]">
            <div className="flex flex-col gap-[10px]">
            <div className="w-[630px] h-[549px] relative rounded-sm max-[700px]:w-[350px] max-[700px]:h-[319px]">
             {currentImage.split(".")[currentImage.split(".").length-1] === "mp4" ? <video src={currentImage} controls autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover no-drag" draggable={false}
            onContextMenu={(e) => e.preventDefault()} /> : <Image className="rounded-sm" src={currentImage} alt="product_picture no-drag" draggable={false}
            onContextMenu={(e) => e.preventDefault()} fill />} 
            </div>
           
              <div className="relative flex gap-[10px]  max-[700px]:gap-[4px]">{item.mediaUrls.map((e,i) => e !== currentImage && <div key={i} onClick={() => setCurrentImage(e)} className="relative w-[131px] h-[119px] max-[700px]:w-[90px] max-[700px]:h-[80px]"> {e.split(".")[e.split(".").length-1] === "mp4" ?<div><Image src={IMG} alt="play" width={40} height={40} className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/><video src={e} className="absolute inset-0 w-full h-full object-cover" /></div> : <Image className=" rounded-sm absolute inset-0 w-full h-full object-cover" src={e} alt="SecondImage" width={131} height={119}/>} </div>)}</div>
            </div>
            <section className="flex flex-col gap-[10px] w-[670px] max-[700px]:w-[360px]">
              
              <div className="flex gap-[10px] bg-[#47474733] h-[209px] flex-col p-[20px] rounded-sm  max-[700px]:h-[140px] max-[700px]:gap-[10px] max-[700px]:p-[10px]">
                <div className="flex justify-between items-center"><h2 className="text-[42px] max-[700px]:text-[24px]">{item.name}</h2> <p className="text-[20px] max-[700px]:text-[14px] text-[#3C3D37]">Přidáno: 22.02.2025</p></div> <p className="text-[24px] max-[700px]:text-[15px]">{item.description}</p>
              </div>
              <div className="flex justify-between">
              <div className="flex gap-[10px] bg-[#47474733] w-[330px] h-[80px] text-[24px] p-[20px] rounded-sm max-[700px]:w-[130px] max-[700px]:h-[60px] max-[700px]:text-[16px] max-[700px]:justify-center max-[700px]:items-center text-center">
                <h3>Váha:</h3> <p>{item.weight}g</p>
              </div>
              <div className="flex gap-[10px] bg-[#47474733] w-[330px] h-[80px] text-[24px] p-[20px] rounded-sm max-[700px]:w-[220px] max-[700px]:h-[60px] max-[700px]:text-[16px] max-[700px]:justify-center max-[700px]:items-center text-center">
                <h3>Material:</h3> <p className="max-[700px]:text-end">{item.material}</p>
              </div>
              </div>
              <div className="flex justify-between">
              <div className="flex gap-[10px] bg-[#47474733] w-[470px] h-[80px] text-[24px] p-[20px] rounded-sm max-[700px]:w-[220px] max-[700px]:h-[60px] max-[700px]:text-[16px] max-[700px]:justify-center max-[700px]:items-center text-center">
                <h3>Specifikace:</h3> <p className="max-[700px]:text-end">{item.specification}</p>
              </div>
              <div className="flex gap-[10px] bg-[#47474733] w-[190px] h-[80px] text-[24px] p-[20px] rounded-sm max-[700px]:w-[130px] max-[700px]:h-[60px] max-[700px]:text-[16px] max-[700px]:justify-center max-[700px]:items-center text-center">
                <h3>Skladem:</h3> <p>{item.stock}ks</p>
              </div>
              </div>
              <div className="flex flex-col justify-end">
                <div className="flex gap-[10px] text-[32px] justify-end my-[40px] max-[700px]:text-[24px] max-[700px]:gap-[5px] max-[700px]:my-[15px]">
                  <h3>Cena:</h3> <p>{item.price}Kč</p>
                </div>
                <button onClick={() => add_to_cart(parseInt(item.id))} className="py-4 px-6 mt-5 ml-auto w-auto self-start bg-orange-100 text-black text-3xl max-[700px]:text-[20px] max-[700px]:w-[200px] max-[700px]:py-2 max-[700px]:px-3 max-[1180px]:text-2xl max-[660px]:text-xl active:bg-opacity-85 hover:bg-opacity-95">
                  Přidat do košíku
                </button>
              </div>
            </section>
          </div>
        ) : (
          <div className="text-[40px]">Loading...</div>
        )}
      </main>
    );
}

