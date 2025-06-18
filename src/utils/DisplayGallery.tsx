"use client"
import { useEffect, useState } from "react";
import GalleryProps from "../utils/interfaces/IFetchGallery";

//clientská stránka
//dostávám obrázky ze serverside
//pracuju s nima a pak je vykreslím

interface Props {
    products: GalleryProps | null;
}
const FetchGallery: React.FC<Props> = ({ products }) => {
    const [show, setShow] = useState(true);//zda se má zobrazit lightbox
    const [curImg, setCurImg] = useState("");//aktuální obrázek
    const [allUrls, setAllUrls] = useState<string[]>([]);//všechny obrázky
    const msg = " NENAČETL SE OBRÁZEK, ZKUSTE OBNOVIT STRÁNKU";//alt text pro obrázky

    useEffect(() => {// odsranit .mp4 abych je nemusel vykreslovat na stranku
        const urls = products?.products?.flatMap((product) =>
            product.mediaUrls ? product.mediaUrls.filter((url) => !url.endsWith(".mp4")) : []
        ) || [];
        setAllUrls(urls);
    }, [products]);
    
    function HandleClick(input:string) {//kliknutí na obrázek na dolní listě v lightboxu
        setCurImg(input)
        Border(input);
    }
    function Border(url:string){//border na dolní liště
        const ur  = url.split("/").pop() as string;
        const img = document.getElementById(ur);
        if(img){
            const allImgs = document.querySelectorAll("img");
            allImgs.forEach((imgs) => {
                if(imgs === img)
                    img.classList.add("border-4", "border-green-400", "rounded-lg");
                else
                    imgs.classList.remove("border-4", "border-green-400", "rounded-lg");
            });
        }
    }
    function HandleLightBox(input?:string) {
        setShow((prev)=>!prev);
        if (input){
            setCurImg(input);
            Border(input);
        } 
        const div = document.getElementById("dv-h");
        const body = document.getElementsByTagName("body")[0];
        if (show) {
            div?.classList.remove("hidden");
            body.classList.add("overflow-hidden");
        }
        else {
            div?.classList.add("hidden");
            body.classList.remove("overflow-hidden");
        }
    }

    const HandleArrow = (direction: "next" | "previous")=>{
        const curId = allUrls.indexOf(curImg);
        if (curId === -1) return;

        const newIndex =
            direction === "next"
                ? (curId + 1) % allUrls.length
                : (curId - 1 + allUrls.length) % allUrls.length;

        setCurImg(allUrls[newIndex]);
        Border(allUrls[newIndex]);
    }
    return (
        <main className="w-screen min-h-screen p-8 grid md:grid-cols-2 sm:grid-cols-1 gap-4 relative pt-20">
            {/* lightbox */}
            <div className="w-full h-[100%] bg-black/50 hidden fixed flex-col z-[1000] top-0" id="dv-h">
                {/* close btn*/}
                <div className="w-full h-[10%] self-start flex justify-center" onClick={() => HandleLightBox()}>
                    <div className="w-[70%] flex justify-end align-bottom" >
                        <p className="absolute rounded-full text-4xl w-12 h-12 cursor-pointer">X</p>
                    </div>
                </div>
                {/* big image and arrows and sides*/}
                <div className="w-full h-[70%] flex justify-center">    
                    <div className="flex-1" onClick={() => HandleLightBox()}></div>
                    <button onClick={()=>HandleArrow("previous")} className="w-[10%] bg-[url('../../public/right-arrow.png')] bg-contain bg-no-repeat rotate-180 bg-center sm:w-[5%]"></button>
                    <img src={curImg} alt={msg}  className="max-w-[70%] h-[100%] object-contain" />
                    <button onClick={()=>HandleArrow("next")} className="w-[10%] bg-[url('../../public/right-arrow.png')] bg-contain bg-no-repeat bg-center sm:w-[5%]"></button>
                    <div className="flex-1" onClick={() => HandleLightBox()}></div>
                </div>

                {/* all images line under big img */}
                <div className="w-full h-[20%] flex justify-center items-center gap-7 overflow-x-auto">
                    {allUrls.map((url,i) => (
                        <img key={i} src={url} alt={msg} id={url.split("/").pop()} onClick={()=>HandleClick(url)} className="max-h-[70%] md:max-w-[200px] sm:max-w-[200px] max-w-[70px]"></img>
                    ))}
                </div>
            </div>

            {/* images */}
            {allUrls.map((url,i) => (
                <img src={url} alt={msg} key={i} className="w-[95%] h-[95%] object-contain" onClick={()=> HandleLightBox(url)}/>
            ))}
        </main>
    )
}
export default FetchGallery;