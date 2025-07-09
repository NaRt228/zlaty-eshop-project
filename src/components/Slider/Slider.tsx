"use client";
import IMG from "../../utils/images/Footer.jpg";
import Image from "next/image";
import "./Slider.css";
import { SliderItem } from "./Item";
import move from "./sliderLogic";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { get_products } from "@/apis_reqests/products";
import { Product_cart } from "@/interface/product_cart";


export const Slider = () => {
  const [priveousWidth, setPreviousWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [images, setImages] = useState<string[]>([""]);
   const items: MutableRefObject<HTMLDivElement | null>[] = [
  useRef<HTMLDivElement | null>(null),
  useRef<HTMLDivElement | null>(null),
  useRef<HTMLDivElement | null>(null),
  useRef<HTMLDivElement | null>(null),
  useRef<HTMLDivElement | null>(null),
  useRef<HTMLDivElement | null>(null),
];
  
  useEffect(() => {
    async function AAA(){
        const product = await get_products();
        console.log(product);
        if(product !== undefined){
          const imageFromApi: string[] = product.products.map((e:Product_cart) => e.mediaUrls[0]);
          setImages(imageFromApi);

        }
      
      }
    
    AAA();
    const resize = async () => {
      if(window.innerWidth == priveousWidth){
        return;
      }
      setTimeout(function() {
        const diferensOfWidth = window.innerWidth + priveousWidth;
        setPreviousWidth(diferensOfWidth);
         items.forEach(e => { 
         if(e.current){
           const width = e.current.style.left.split("px");
           e.current.style.left = `${parseFloat(width[0]) + diferensOfWidth}px`;
         }
       }, 1)
      }
    )
    };
   addEventListener("resize", resize)

   return () => { removeEventListener("resize", resize)};
  }, [])
  return (
    <section className="slider-container">
      <div className="bacground-container">
        <div className="background-hidder"></div>
        <div className="img-cont">
          <Image src={IMG} alt="background" className="back-img" />
        </div>
      </div>
      <div className="h2-container">
        <h2 className="h2-moje">Moje práce</h2>
      </div>
      <section className="slider">
        {items.map((it, i) => (
          <SliderItem move={move}  items={items} key={i} image={images[i < images.length ? i : images.length-1]}/>
        ))}
      </section>
    </section>
  );
};
