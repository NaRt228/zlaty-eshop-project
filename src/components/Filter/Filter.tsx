"use client";
import React, { useState } from "react";
import Slider from "@mui/material/Slider";

const Filter = () => {
  const sortOptions = [
    { label: "Nejdražší", value: "priceAsc" },
    { label: "Nejlevnější", value: "priceDesc" },
    { label: "A-Z", value: "abcASC" },
    { label: "Z-A", value: "abcDESC" },
  ];
   const [priceRange, setPriceRange] = useState([0, 15632]);

  const handlePriceChange = (event:any, newValue:any) => {
    setPriceRange(newValue);
  };
  const [sortSelected, setSortSelected] = useState(sortOptions[0]);
  const [materialSelected, setMaterialSelected] = useState() 
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#1D1D1DF7] bg-opacity-80 text-opacity-80 p-5 w-[300px] ml-3  text-white absolute mt-4 ">
      <p className="text-[18px] font-bold">Filtry:</p>
      <div className=" flex justify-between">
        <p className="text-[18px] mt-[10px]">Seřadit podle:</p>
        <div
          className="bg-zinc-800 p-2 rounded cursor-pointer flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          {sortSelected.label}
          <span>{isOpen?<>▲</>:<>▼</>}</span>
        </div>
        {isOpen && (
          <div className="bg-[#1D1D1DF7] border mt-1 rounded shadow-md absolute w-full z-10">
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
            <li className=" text-slate-300  text-[18px] cursor-pointer">Zlato</li>
            <li className=" text-slate-300 text-[18px] cursor-pointer">Stříbro</li>
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
            <li className=" text-slate-300 text-[18px] cursor-pointer">Prsteny</li>
            <li className=" text-slate-300 text-[18px] cursor-pointer">Nahrdelniky</li>
            <li className=" text-slate-300 text-[18px] cursor-pointer">Kyvadla</li>
            <li className=" text-slate-300 text-[18px] cursor-pointer">Nausnice</li>
        </ul>
      </div>
    </div>
  );
};

export default Filter;
