"use client"
import "./domu.css";
import Image from "next/image";
import IMG from "../utils/images/image1.png";
import { Slider } from "@/components/Slider/Slider";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Home() {
   const [width, setWidth] = useState<number>( typeof window !== "undefined" ? window.innerWidth : 0);
  useEffect(() => {
    const resize = () => setTimeout(() => { setWidth(window.innerWidth) }, 1);
    window.addEventListener("resize", resize)
    return () => {  window.removeEventListener("resize", resize) }
  }, [])
  return (
    <main className="overflow-hidden">
      <div className="first-vi max-[1360px]:!flex-col max-[1360px]:gap-[30px] max-[600px]:!pl-[15px] max-[450px]:!mt-[50px]">
        <section className="section-vyroba max-[1360px]:!w-[500px] max-[600px]:!w-[300px]  max-[1360px]:!justify-center max-[1360px]:!items-center">
          <h1 className="h1-vyroba max-[1372px]:!text-[46px] max-[600px]:!text-[30px]">Výroba autorských šperků</h1>
          <p className="h1-p-vyroba max-[1372px]:!w-[500px] max-[1372px]:!text-[22px] max-[600px]:!w-[300px] max-[600px]:!text-[16px]">
            Lorem ipsum nevim nevimLorem ipsum nevim nevimLorem ipsum nevim
            nevimLorem ipsum nevim nevim
          </p>
          <button className="button-vice mr-auto">Více</button>
        </section>
        <section className="img-container ml-[150px] !relative max-[1372px]:!m-0 max-[600px]:!w-[300px] max-[600px]:!h-[320px]">
          <div className=" absolute h-[100%] w-[100%] bg-[#3E3E3E] top-[15px] left-[15px] "></div>
            <Image src={IMG} alt="ring" fill style={{ objectFit: 'cover' }}/>
        </section>
      </div>
      <div>
        <Slider/>
      </div>
      <div>
        <section className="imgs-container ">
          {(width > 1000) && <div className="fir relative">
            <Link className="absolute bottom-[-15px] right-[10px] z-10 bg-black px-[10px] py-[5px] text-[20px]" href={`/nakupovat`}>Nakupovat</Link>
          <Image src={IMG} alt="work3" id="work3"/>
          </div>}
          {width < 620 && 
          <div className="fir relative">
          <Image src={IMG} alt="work3" id="work3"/>
           <Link className="absolute bottom-[10px] right-[10px] z-10 bg-black px-[10px] py-[5px] text-[20px]" href={`/nakupovat`}>Nakupovat</Link>
          </div>}
          {width > 620 &&  
 <div className="sco relative">

  <Link
    href="/nakupovat"
    className="absolute bottom-[230px] right-[10px] max-[700px]:bottom-[30px] z-10 bg-black px-[10px] max-[700px]:right-[320px] py-[5px] max-[1000px]:right-[330px] text-white max-[1000px]:bottom-[35px]"
  >
    Nakupovat
  </Link>

 
  <Link
    href="/nakupovat"
    className="absolute max-[1000px]:bottom-[10px] bottom-[-15px] max-[1000px]:right-[-90px]  max-[700px]:right-[10px] max-[800px]:right-[10px] max-[900px]:right-[-40px] right-[10px] z-10 bg-black px-[10px] py-[5px] text-white"
  >
    Nakupovat
  </Link>


  <Image src={IMG} alt="work" id="work" />
  <Image src={IMG} alt="work2" id="work2" />
</div>
          }
         
        </section>
      </div>
    </main>
  );
}