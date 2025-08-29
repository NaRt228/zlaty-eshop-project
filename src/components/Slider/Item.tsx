"use client";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef} from "react";

let f:number= 0;
export const SliderItem = (props: {move: (item: MutableRefObject<HTMLDivElement | null>, items: MutableRefObject<HTMLDivElement | null>[], f:number) => void, items: MutableRefObject<HTMLDivElement | null>[], image: string , name: string, price: string},   ) => {
  const item = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    props.move(item, props.items, f)
    f++;
    if(f== 6){
      props.move(item, props.items, f)
    }
    return () => {f=0};
  }, []);

  return (
    <section className="slider-item" ref={item}>
      <div className="slider-img"><Image src={props.image} alt="poduct" fill style={{ objectFit: 'cover' }}/></div>
      <div className="text-info-slider-item">
        <h3 className="max-[600px]:!text-[30px]">{props.name}</h3>
        <p className="max-[600px]:!text-[28px]">{props.price}</p>
      </div>
    </section>
  );
};
