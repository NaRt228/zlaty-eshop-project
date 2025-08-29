
import { MutableRefObject } from "react";


export default async function move(position: MutableRefObject<HTMLDivElement | null>, items: MutableRefObject<HTMLDivElement | null>[], f: number) {
  
    if (f < 6) {
       let space = 100;
       let neco = 376;
          if (window.innerWidth < 1000) {
            if (window.innerWidth <= 500) {
                space = 5;
              neco = 280
            } else {
              neco = 360
              space = 20;
            }
          }
         
      items[f] = position;
      if (items[f].current)
        items[f].current!.style.left = `${(neco + space) * f}px`;
    } else {
      if (f === 6) {
        setInterval(() => {
          let min: number = window.innerWidth;
           let space = 100;
       let neco = 376;
          if (window.innerWidth < 1000) {
            if (window.innerWidth <= 500) {
              space = 5;
              neco = 280
            } else {
              neco = 360
              space = 20;
            }
          }
          items.forEach((element) => {
            if (element.current) {
              const width = element.current.style.left.split("px")[0];
              element.current.style.left = `${
                parseFloat(width) + .1
              }px`;
            }
          });
          items.forEach((element) => {
            if (element.current && element.current?.getBoundingClientRect().left > window.innerWidth) {
              items.forEach((element2) => {
                if (element2.current) {
                  min = Math.min(min, element2.current.getBoundingClientRect().left);
                }
              });
              element.current.style.left = `${min - neco - space}px`;
            }
          });
        }, 1);
        f++;
      }
    }
  }