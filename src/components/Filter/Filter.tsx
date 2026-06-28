"use client";
import { useEffect, useState } from "react";
import { ItemProps } from "../Item/Item";
import { get_categories } from "@/apis_reqests/category";
import { get_materials, Material } from "@/apis_reqests/material";

const Filter = (props: { product: ItemProps[], separated: ItemProps[][], setSeparated: (value: ItemProps[][]) => void, chunkArray: (arr: ItemProps[], size: number) => ItemProps[][] }) => {
  const sortOptions = [
    { label: "Nejdražší", value: "priceAsc" },
    { label: "Nejlevnější", value: "priceDesc" },
    { label: "A-Z", value: "abcASC" },
    { label: "Z-A", value: "abcDESC" },
    { label: "Nic", value: "" },
  ];

  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortSelected, setSortSelected] = useState<{ label: string; value: string } | null>(null);
  const [categoryFech, setCategoryFech] = useState<{ name: string; id: number }[] | undefined>(undefined);
  const [categorySelected, setCategorySelected] = useState<number | null>(null);
  const [categoryGroupFilter, setCategoryGroupFilter] = useState<string | null>(null);
  const [materialSelected, setMaterialSelected] = useState<number | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const getGroupKeyword = (param: string) => {
    const p = param.toLowerCase();
    if (p.includes("zlato") || p.includes("zlat")) return "zlat";
    if (p.includes("stříbro") || p.includes("stříbr")) return "stříbr";
    if (p.includes("kyvadl")) return "kyvadl";
    return p;
  };

  useEffect(() => {
    (async function () {
      const [cats, mats] = await Promise.all([get_categories(), get_materials()]);
      setCategoryFech(cats);
      setMaterials(mats || []);

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const categoryParam = params.get("category");
        if (categoryParam && cats) {
          const paramLower = categoryParam.toLowerCase();
          const isGroup = ["zlato", "stříbro", "kyvadla"].includes(paramLower);

          if (isGroup) {
            setCategoryGroupFilter(getGroupKeyword(categoryParam));
          } else {
            const matchedCat = cats.find(
              (c) => c.name.toLowerCase() === paramLower
            );
            if (matchedCat) {
              setCategorySelected(matchedCat.id);
            } else {
              setCategoryGroupFilter(getGroupKeyword(categoryParam));
            }
          }
        }
      }
    })();
  }, []);


  // Apply all filters whenever any filter state changes
  useEffect(() => {
    let product = [...props.product];

    // Price range filter
    product = product.filter(e => e.price >= priceRange[0] && e.price <= priceRange[1]);

    // Category filter
    if (categorySelected !== null) {
      product = product.filter(e => e.category_id !== undefined && Number(e.category_id) === categorySelected);
    } else if (categoryGroupFilter !== null && categoryFech) {
      const matchedCatIds = categoryFech
        .filter((c) => c.name.toLowerCase().includes(categoryGroupFilter.toLowerCase()))
        .map((c) => c.id);
      product = product.filter((e) => {
        const matchesCategory = e.category_id !== undefined && matchedCatIds.includes(Number(e.category_id));
        const matchesMaterial = e.materials && e.materials.some((m) => 
          m.toLowerCase().includes(categoryGroupFilter.toLowerCase())
        );
        return matchesCategory || matchesMaterial;
      });
    }

    // Material filter
    if (materialSelected !== null) {
      const selectedMat = materials.find((m) => m.id === materialSelected)
      if (selectedMat) {
        product = product.filter(
          (e) => e.materials && e.materials.some((m) => m.toLowerCase() === selectedMat.name.toLowerCase())
        )
      }
    }

    // Sort
    switch (sortSelected?.value) {
      case "priceAsc":
        product.sort((a, b) => b.price - a.price);
        break;
      case "priceDesc":
        product.sort((a, b) => a.price - b.price);
        break;
      case "abcASC":
        product.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "abcDESC":
        product.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    props.setSeparated(props.chunkArray(product, 3));
  }, [sortSelected, priceRange, categorySelected, categoryGroupFilter, materialSelected, props.product, materials, categoryFech]);



  return (
    <div className="bg-black border border-neutral-800 p-6 w-full text-white max-h-[500px] overflow-y-auto">
      <p className="text-[18px] font-light uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">Filtry</p>

      {/* Sort */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-[16px] font-light">Seřadit podle:</p>
        <div
          className="bg-black border border-neutral-700 p-2 rounded-none cursor-pointer flex justify-between items-center min-w-[120px] text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">{sortSelected?.label === "Nic" ? "Výchozí" : sortSelected?.label}</span>
          <span className="text-xs ml-2">{isOpen ? "▲" : "▼"}</span>
        </div>
        {isOpen && (
          <div className="bg-black border border-neutral-700 mt-1 rounded-none shadow-2xl absolute w-[200px] right-7 top-[78px] z-10 text-sm">
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className="p-2.5 hover:bg-neutral-900 cursor-pointer transition-colors duration-150"
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

      {/* Price Range 
      <div className="mt-4 border-t border-neutral-800 pt-4">
        <p className="text-[16px] font-light mb-2">Cena:</p>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          min={0}
          max={100000}
          valueLabelDisplay="auto"
          sx={{
            color: "#fff",
            "& .MuiSlider-thumb": {
              borderRadius: "0px",
              backgroundColor: "#fff",
            },
            "& .MuiSlider-track": {
              backgroundColor: "#fff",
            },
            "& .MuiSlider-rail": {
              backgroundColor: "#333",
            }
          }}
        />
        <div className="flex justify-between text-xs text-neutral-400 font-mono mt-1">
          <span>{priceRange[0].toLocaleString()} Kč</span>
          <span>{priceRange[1].toLocaleString()} Kč</span>
        </div>
      </div>
          */}
      {/* Category Filter */}
      <div className="flex mt-6 gap-4 border-t border-neutral-800 pt-4">
        <p className="text-[16px] font-light">Kategorie:</p>
        <ul className="flex flex-col gap-2">
          {categoryFech?.map((e) => {
            const isActive = categorySelected === e.id || 
              (categoryGroupFilter !== null && e.name.toLowerCase().includes(categoryGroupFilter.toLowerCase()));
            return (
              <li
                key={e.id}
                onClick={() => {
                  setCategorySelected(categorySelected === e.id ? null : e.id);
                  setCategoryGroupFilter(null);
                }}
                className={`${isActive ? "text-white underline underline-offset-4 font-semibold" : "text-neutral-400 hover:text-white"} text-sm tracking-wide cursor-pointer first-letter:uppercase transition-colors duration-200`}
              >
                {e.name}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Material Filter */}
      {materials.length > 0 && (
        <div className="mt-6 border-t border-neutral-800 pt-4">
          <p className="text-[16px] font-light mb-3">Materiál:</p>
          <ul className="flex flex-col gap-2">
            {materials.map((mat) => (
              <li
                key={mat.id}
                onClick={() => setMaterialSelected(materialSelected === mat.id ? null : mat.id)}
                className={`${
                  materialSelected === mat.id
                    ? "text-white underline underline-offset-4 font-semibold"
                    : "text-neutral-400 hover:text-white"
                } text-sm tracking-wide cursor-pointer transition-colors duration-200`}
              >
                
                {mat.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reset all filters */}
      {(categorySelected !== null || categoryGroupFilter !== null || materialSelected !== null || sortSelected !== null || priceRange[0] !== 0 || priceRange[1] !== 100000) && (
        <button
          onClick={() => {
            setCategorySelected(null);
            setCategoryGroupFilter(null);
            setMaterialSelected(null);
            setSortSelected(null);
            setPriceRange([0, 100000]);
          }}
          className="mt-6 w-full border border-neutral-700 hover:border-white text-neutral-400 hover:text-white text-xs font-light tracking-widest uppercase py-2 transition-all duration-200 rounded-none"
        >
          Zrušit filtry
        </button>
      )}
    </div>
  );
};

export default Filter;
