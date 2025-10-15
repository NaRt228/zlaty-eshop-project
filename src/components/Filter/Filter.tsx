"use client";
import React, { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import { ItemProps } from "../Item/Item";
import { get_categories } from "@/apis_reqests/category";

const Filter = (props: { product: ItemProps[],  separated: ItemProps[][], setSeparated: (value: ItemProps[][]) => void, chunkArray:  (arr: ItemProps[], size: number) => ItemProps[][]} ) => {
  const sortOptions = [
    { label: "Nejdražší", value: "priceAsc" },
    { label: "Nejlevnější", value: "priceDesc" },
    { label: "A-Z", value: "abcASC" },
    { label: "Z-A", value: "abcDESC" },
    { label: "Nic", value: "" },
  ];
   const [priceRange, setPriceRange] = useState([0, 15632]);

  const handlePriceChange = (event: Event, newValue:number[]) => {
    setPriceRange(newValue);
  };
   const [width, setWidth] = useState<number>( typeof window !== "undefined" ? window.innerHeight : 0);
  useEffect(() => {
    const resize = () => setTimeout(() => { setWidth(window.innerHeight) }, 1);
    window.addEventListener("resize", resize)
    return () => {  window.removeEventListener("resize", resize) }
  }, [])
  const [sortSelected, setSortSelected] = useState<{label: string, value: string} | null>(null);
  const [categorySelected, setCategorySelected] = useState<string | null>(null);
  const [categoryFech, setCategoryFech] = useState<{name: string, id: number}[] | undefined>(undefined);
  const [materialSelected, setMaterialSelected] = useState<number | null>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
   (async function(){
      setCategoryFech(await get_categories().then(e=>e))
   })()
    
  }, [])
 useEffect(() => {
   let product = props.product;
   product = MaxPriceRange(props.product, priceRange)
   categoryFech?.forEach(element => {
    if(element.id === materialSelected){
      product = MaterialFilterZlato(product, element.id);
    }
   });
   switch (sortSelected?.value) {
     case "priceAsc":
       product = SortToMin(product);
       break;
     case "priceDesc":
       product = SortToMax(product);
       break;
     case "abcASC":
       product = SortToZ(product);
       break;
     case "abcDESC":
       product = SortToA(product);
       break;
   }
   switch (categorySelected ?? "") {
     case "Prsteny":
       MaterialFilterP(product);
       break;
     case "Nahrdelniky":
       MaterialFilterN(product);
       break;
     case "Kyvadla":
       MaterialFilterK(product);
       break;
     case "Nausnice":
       MaterialFilterNA(product);
       break;
   }
 }, [sortSelected, categorySelected, priceRange, materialSelected]);

  function SortToMax(data: ItemProps[]){
    data.sort((a, b) => a.price - b.price);
     props.setSeparated(props.chunkArray(data, 3))
      return data;
  }

  function SortToMin(data: ItemProps[]){
    data.sort((a, b) => b.price - a.price);
     props.setSeparated(props.chunkArray(data, 3))
      return data;
  }
  
    function SortToZ(data: ItemProps[]){
    data.sort((a, b) => a.title.localeCompare(b.title));
     props.setSeparated(props.chunkArray(data, 3))
     MaxPriceRange(props.product, priceRange)
     return data;
  }

   function SortToA(data: ItemProps[]){
    data.sort((a, b) => b.title.localeCompare(a.title));
    props.setSeparated(props.chunkArray(data, 3))
    return data;
  }

  function MaxPriceRange(data: ItemProps[], range: number[]){
     data = data.filter(e => e.price > range[0] && range[1] > e.price);
     props.setSeparated(props.chunkArray(data, 3))
     return data;
  }

  function MaterialFilterP(data: ItemProps[]){
      data = data.filter(e => "Prsteny" == e.specification);
      props.setSeparated(props.chunkArray(data, 3))
      return data;
  }

  function MaterialFilterN(data: ItemProps[]){
      data = data.filter(e => "Nahrdelniky" == e.specification);
      props.setSeparated(props.chunkArray(data, 3))
      return data;
  } 

  function MaterialFilterK(data: ItemProps[]){
      data = data.filter(e => "Kyvadla" == e.specification);
      props.setSeparated(props.chunkArray(data, 3))
      return data;
  }

  function MaterialFilterZlato(data: ItemProps[], category: number){
      
      
      data = data.filter(e => category == e.category_id);
      props.setSeparated(props.chunkArray(data, 3))
      return data;
  }

  function MaterialFilterNA(data: ItemProps[]){
      MaxPriceRange(props.product, priceRange)
      data = data.filter(e => "Nausnice" == e.specification);
      props.setSeparated(props.chunkArray(data, 3))
      return data;
  }
  return (
    
    <div className={`bg-[#1D1D1DF7] bg-opacity-80 text-opacity-80 p-7 w-[350px] ml-3  text-white absolute mt-4 z-10 max-h-[${width < 500 ? 300 : 500}px] overflow-y-auto`}>
      <p className="text-[18px] font-bold">Filtry:</p>
      <div className=" flex justify-between">
        <p className="text-[18px] mt-[10px]">Seřadit podle:</p>
        <div
          className="bg-zinc-800 p-2 rounded cursor-pointer flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
           {sortSelected?.label === "Nic" ? "" : sortSelected?.label}
          <span>{isOpen?<>▲</>:<>▼</>}</span>
        </div>
        {isOpen && (
          <div className="bg-[#1D1D1DF7] border mt-1 rounded shadow-md absolute w-[250px] z-10">
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className="p-2 hover:bg-gray-900 cursor-pointer"
                onClick={() => {
                  setSortSelected(option);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className=" flex mt-[10px] gap-[15px]">
        <p className=" text-[18px] ">Material:</p>
        <ul className=" flex flex-col gap-[5px]">
          {categoryFech?.map((e) =>  <li key={e.id} onClick={() => setMaterialSelected(materialSelected === e.id ? null : e.id)} className={`${materialSelected === e.id ? "text-slate-300" : "text-blue-400"}   text-[18px] cursor-pointer`}>{e.name}</li>)}
        </ul>
      </div>
      <div className="mt-4">
        <p className="text-[18px]">Cena:</p>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          min={0}
          max={15632}
          valueLabelDisplay="auto"
          sx={{
            color: "#555", // Barva slideru
          }}
        />
        <div className="flex justify-between text-[16px]">
          <span>{priceRange[0]} czk</span>
          <span>{priceRange[1]} czk</span>
        </div>
      </div>
      <div className=" flex mt-[10px] gap-[15px]">
        <p className=" text-[18px] ">Kategorie:</p>
        <ul className=" flex flex-col gap-[5px]">
            <li onClick={() =>  setCategorySelected(categorySelected === "Prsteny" ? null : "Prsteny")} className={`${categorySelected === "Prsteny" ? "text-blue-400" : "text-slate-300"} text-[18px] cursor-pointer`}>Prsteny</li>
            <li onClick={() => setCategorySelected(categorySelected === "Nahrdelniky" ? null : "Nahrdelniky")} className={`${categorySelected === "Nahrdelniky" ? "text-blue-400" : "text-slate-300"} text-[18px] cursor-pointer`}>Nahrdelniky</li>
            <li onClick={() => setCategorySelected(categorySelected === "Kyvadla" ? null : "Kyvadla")} className={`${categorySelected === "Kyvadla" ? "text-blue-400" : "text-slate-300"} text-[18px] cursor-pointer`}>Kyvadla</li>
            <li onClick={() => setCategorySelected(categorySelected === "Nausnice" ? null : "Nausnice")} className={`${categorySelected ==="Nausnice" ? "text-blue-400" : "text-slate-300"} text-[18px] cursor-pointer`}>Nausnice</li>
        </ul>
      </div>
    </div>
  );
};

export default Filter;
