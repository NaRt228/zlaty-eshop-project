"use client"
import "./domu.css";
import Image from "next/image";
import { Slider } from "@/components/Slider/Slider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { get_content } from "@/apis_reqests/content";

export default function Home() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const data = await get_content();
      if (data) {
        setContent(data);
      }
    }
    loadData();
  }, []);

  
  const heroTitle = content?.heroTitle
  const heroText = content?.heroText
  const heroImageUrl = content?.heroImageUrl

  const card1Title = content?.card1Title
  const card1Text = content?.card1Text
  const card1ImageUrl = content?.card1ImageUrl 

  const card2Title = content?.card2Title 
  const card2Text = content?.card2Text 
  const card2ImageUrl = content?.card2ImageUrl 

  const card3Title = content?.card3Title 
  const card3Text = content?.card3Text 
  const card3ImageUrl = content?.card3ImageUrl 

  const cardGoldTitle = content?.cardGoldTitle || "Zlato"
  const cardGoldText = content?.cardGoldText || "Klasická elegance v sériové výrobě"
  const cardGoldImageUrl = content?.cardGoldImageUrl || "/jewelry1.jpg"

  const cardSilverTitle = content?.cardSilverTitle || "Stříbro"
  const cardSilverText = content?.cardSilverText || "Decentní krása pro každý den"
  const cardSilverImageUrl = content?.cardSilverImageUrl || "/jewelry2.jpg"

  return (
    <main className="w-full min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 md:py-40 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left text column */}
        <section className="flex flex-col gap-6 max-w-xl text-center lg:text-left items-center lg:items-start">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-wide leading-tight text-white uppercase">
            {heroTitle}
          </h1>
          <div className="w-20 h-[1px] bg-neutral-800 my-2"></div>
          <p className="text-neutral-400 text-base sm:text-lg font-light leading-relaxed whitespace-pre-line">
            {heroText}
          </p>
          <div className="relative group w-fit mt-4">
            <div className="absolute inset-0 border border-white/20 translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300 z-0"></div>
            <Link href="/about" className="relative z-10 block px-8 py-3.5 bg-white text-black border border-white hover:bg-black hover:text-white transition duration-300 tracking-widest text-sm uppercase font-semibold">
              Více o mně
            </Link>
          </div>
        </section>

        {/* Right image column with offset box */}
        <section className="relative w-full max-w-[460px] aspect-[4/5] sm:aspect-square flex-shrink-0 group">
          <div className="absolute inset-0 border border-white/10 translate-x-4 translate-y-4 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500 z-0"></div>
          <div className="relative z-10 w-full h-full bg-black border border-white/20 overflow-hidden">
            <Image
              src={heroImageUrl}
              alt="Jovana Šichová autorský šperk"
              fill
              priority
              unoptimized
              draggable={false}
              className="object-cover transition-all duration-700 group-hover:scale-105 select-none"
            />
          </div>
        </section>
      </div>

      {/* Slider Section */}
      <div className="w-full py-10 bg-black">
        <Slider />
      </div>

      {/* Asymmetric Showcase Grid Section */}
      <div className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-widest uppercase mb-3">Autorská tvorba</h2>
          <div className="w-16 h-[1px] bg-neutral-800 mx-auto"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Card 1 */}
          <div className="relative group flex flex-col">
            <div className="absolute inset-0 border border-white/10 translate-x-3 translate-y-3 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500 z-0"></div>
            <Link href={`/nakupovat?category=${encodeURIComponent(card1Title)}&productionType=Autorsk%C3%A1`} className="relative z-10 w-full aspect-[4/5] bg-black border border-white/20 overflow-hidden cursor-pointer">
              <Image
                src={card1ImageUrl}
                alt={card1Title}
                fill
                unoptimized
                className="object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end z-20">
                <h3 className="text-xl font-light uppercase tracking-widest text-white mb-2">{card1Title}</h3>
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-light">{card1Text}</p>
              </div>
            </Link>
            <Link href={`/nakupovat?category=${encodeURIComponent(card1Title)}&productionType=Autorsk%C3%A1`} className="cursor-pointer z-10 mt-6 text-sm uppercase tracking-widest text-white hover:text-neutral-400 font-semibold flex items-center gap-2 transition-all duration-300">
              Prozkoumat kolekci &rarr;
            </Link>
          </div>
          
          {/* Card 2 - Slightly offset vertically for visual interest */}
          <div className="relative group flex flex-col md:translate-y-6">
            <div className="absolute inset-0 border border-white/10 translate-x-3 translate-y-3 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500 z-0"></div>
            <Link href={`/nakupovat?category=${encodeURIComponent(card2Title)}&productionType=Autorsk%C3%A1`} className="relative z-10 w-full aspect-[4/5] bg-black border border-white/20 overflow-hidden cursor-pointer">
              <Image
                src={card2ImageUrl}
                alt={card2Title}
                fill
                unoptimized
                className="object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end z-20">
                <h3 className="text-xl font-light uppercase tracking-widest text-white mb-2">{card2Title}</h3>
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-light">{card2Text}</p>
              </div>
            </Link>
            <Link href={`/nakupovat?category=${encodeURIComponent(card2Title)}&productionType=Autorsk%C3%A1`} className="cursor-pointer z-10 mt-6 text-sm uppercase tracking-widest text-white hover:text-neutral-400 font-semibold flex items-center gap-2 transition-all duration-300">
              Prozkoumat kolekci &rarr;
            </Link>
          </div>

          {/* Card 3 */}
          <div className="relative group flex flex-col">
            <div className="absolute inset-0 border border-white/10 translate-x-3 translate-y-3 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500 z-0"></div>
            <Link href={`/nakupovat?category=${encodeURIComponent(card3Title)}&productionType=Autorsk%C3%A1`} className="relative z-10 w-full aspect-[4/5] bg-black border border-white/20 overflow-hidden cursor-pointer">
              <Image
                src={card3ImageUrl}
                alt={card3Title}
                fill
                unoptimized
                className="object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end z-20">
                <h3 className="text-xl font-light uppercase tracking-widest text-white mb-2">{card3Title}</h3>
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-light">{card3Text}</p>
              </div>
            </Link>
            <Link href={`/nakupovat?category=${encodeURIComponent(card3Title)}&productionType=Autorsk%C3%A1`} className="mt-6 text-sm uppercase tracking-widest text-white hover:text-neutral-400 font-semibold flex items-center gap-2 transition-all duration-300 cursor-pointer z-10">
              Prozkoumat kolekci &rarr;
            </Link>
          </div>
        </div>

        {/* Serial Production Section */}
        <div className="max-w-7xl mx-auto px-4 mt-32 pt-20 border-t border-neutral-900">
          <div className="mb-16 text-center">
            <h2 className="text-2xl md:text-3xl font-light tracking-widest uppercase mb-3">Sériová výroba</h2>
            <div className="w-16 h-[1px] bg-neutral-800 mx-auto"></div>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 mb-8">
            {/* Card Gold */}
            <div className="relative group flex flex-col">
              <div className="absolute inset-0 border border-white/10 translate-x-3 translate-y-3 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500 z-0"></div>
              <Link href={`/nakupovat?category=S%C3%A9riov%C3%A1&productionType=S%C3%A9riov%C3%A1`} className="relative z-10 w-full aspect-[4/5] bg-black border border-white/20 overflow-hidden cursor-pointer">
                <Image
                  src={cardGoldImageUrl}
                  alt={cardGoldTitle}
                  fill
                  unoptimized
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/20 transition-all duration-300"></div>
                <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end z-20">
                  <h3 className="text-xl font-light uppercase tracking-widest text-white mb-2">{cardGoldTitle}</h3>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider font-light">{cardGoldText}</p>
                </div>
              </Link>
              <Link href={`/nakupovat?category=S%C3%A9riov%C3%A1&productionType=S%C3%A9riov%C3%A1`} className="cursor-pointer z-10 mt-6 text-sm uppercase tracking-widest text-white hover:text-neutral-400 font-semibold flex items-center gap-2 transition-all duration-300">
                Prozkoumat kolekci &rarr;
              </Link>
            </div>

            {/* Card Silver */}
            <div className="relative group flex flex-col">
              <div className="absolute inset-0 border border-white/10 translate-x-3 translate-y-3 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500 z-0"></div>
              <Link href={`/nakupovat?category=S%C3%A9riov%C3%A1&productionType=S%C3%A9riov%C3%A1`} className="relative z-10 w-full aspect-[4/5] bg-black border border-white/20 overflow-hidden cursor-pointer">
                <Image
                  src={cardSilverImageUrl}
                  alt={cardSilverTitle}
                  fill
                  unoptimized
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/20 transition-all duration-300"></div>
                <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end z-20">
                  <h3 className="text-xl font-light uppercase tracking-widest text-white mb-2">{cardSilverTitle}</h3>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider font-light">{cardSilverText}</p>
                </div>
              </Link>
              <Link href={`/nakupovat?category=S%C3%A9riov%C3%A1&productionType=S%C3%A9riov%C3%A1`} className="cursor-pointer z-10 mt-6 text-sm uppercase tracking-widest text-white hover:text-neutral-400 font-semibold flex items-center gap-2 transition-all duration-300">
                Prozkoumat kolekci &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
// Rebuild trigger: 2026-07-13