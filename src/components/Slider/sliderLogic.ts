
import { MutableRefObject } from "react";
import { LogicProps } from "./Item";
const state: boolean[] = [true];
let g: MutableRefObject<HTMLDivElement | null>[] = [];
export default async function move(prop: LogicProps) {
    if(prop.f === 7){
       const min: number = window.innerWidth;
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
       prop.takeUpStop(state, g,min, neco, space, prop.mouseX ?? 0 );
    }
    if (prop.f < 6) {
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
         
      prop.items[prop.f] = prop.item;
      g = prop.items;
      if (prop.items[prop.f].current)
        prop.items[prop.f].current!.style.left = `${(neco + space) * prop.f}px`;
    } else {
      if (prop.f === 6) {
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
          if (state[0]) {
          console.log("stop: "+ state[0])
          prop.items.forEach((element) => {
            if (element.current) {
              const width = element.current.style.left.split("px")[0];
              element.current.style.left = `${
                parseFloat(width) + .1
              }px`;
            }
          });
          prop.items.forEach((element) => {
            if (element.current && element.current?.getBoundingClientRect().left > window.innerWidth) {
              prop.items.forEach((element2) => {
                if (element2.current) {
                  min = Math.min(min, element2.current.getBoundingClientRect().left);
                }
              });
              element.current.style.left = `${min - neco - space}px`;
            }
          });
          }

        }, 1);
        prop.f++;
      }
    }
  }