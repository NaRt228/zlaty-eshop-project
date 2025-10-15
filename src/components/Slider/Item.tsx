"use client";
import Image from "next/image";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";


interface MoveLogic {
  (prop: LogicProps): void;
}

export interface LogicProps {
  item: MutableRefObject<HTMLDivElement | null>;
  items: MutableRefObject<HTMLDivElement | null>[];
  f: number;
  mouseX?: number;
  takeUpStop: (
    stop: boolean[],
    items: MutableRefObject<HTMLDivElement | null>[],
    min: number,
    neco: number,
    space: number,
    mousex: number
  ) => void;
}

export interface ISliderItem {
  move: MoveLogic;
  items: MutableRefObject<HTMLDivElement | null>[];
  image: string;
  name: string;
  price: string;
}

let f: number = 0;
export const SliderItem = (props: ISliderItem) => {
  const item = useRef<HTMLDivElement | null>(null);

  const takeUpStop = useCallback(function (
    stop: boolean[],
    items: MutableRefObject<HTMLDivElement | null>[],
    min: number,
    neco: number,
    space: number,
    mousex: number
  ) {
    let start: number = mousex ?? 0;
    function moveSliderCursor(
      x: number,
      items: MutableRefObject<HTMLDivElement | null>[],
      SomeMin = min,
    ) {
      ;
    const maxLeft =  parseInt(items.sort((a, b) =>  parseFloat(a.current?.style.left || "0") - parseFloat(b.current?.style.left || "0"))[items.length - 1].current?.style.left || "0")
   
     let spaceA = 100;
     if (window.innerWidth < 1000) {
            if (window.innerWidth <= 500) {
             spaceA = 30;
            } else {
             spaceA = 50;
            }
          }
     const width = min-neco - spaceA;
      if(width >= maxLeft){
        if(x <= start){
          
          start=x;
          return;
        }
      }
      items.forEach((element) => {
        if (element.current) {
          const width = element.current.style.left.split("px")[0];
          element.current.style.left = `${parseFloat(width) + (x - start)}px`;
        }
      });
        items.forEach((element) => {
            if (element.current && element.current?.getBoundingClientRect().left > window.innerWidth) {
              items.forEach((element2) => {
                if (element2.current) {
                  SomeMin = Math.min(SomeMin, element2.current.getBoundingClientRect().left);
                  
                }
              });
              element.current.style.left = `${SomeMin - neco - space}px`;
            }
          });
          
       start=x;
    }
    const handleMouseMove = (e: MouseEvent) => moveSliderCursor(e.clientX, items);
    if (stop != null) {
      
      if (stop[0]) {
        document.addEventListener("mousemove", handleMouseMove)
      }
    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        stop[0] = !stop[0];
      };
    document.addEventListener("mouseup", handleMouseUp);
     stop[0] = !stop[0];
    }
  },
  []);
  useEffect(() => {
    props.move({ item, items: props.items, f, takeUpStop });
    if (++f == 6) {
      props.move({ item, items: props.items, f, takeUpStop });
    }

    return () => {
      f = 0;
    };
  }, []);

  return (
    <section
      className="slider-item"
      ref={item}
      onMouseDown={(e) =>
        props.move({
          item,
          items: props.items,
          f: 7,
          takeUpStop,
          mouseX: e.clientX,
        })
      }
    >
      <div className="slider-img">
        <Image
          src={props.image}
          alt="poduct"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="text-info-slider-item">
        <h3 className="max-[600px]:!text-[30px]">{props.name}</h3>
        <p className="max-[600px]:!text-[28px]">{props.price}</p>
      </div>
    </section>
  );
};
