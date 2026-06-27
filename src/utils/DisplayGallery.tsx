"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import GalleryProps from "../utils/interfaces/IFetchGallery";
import Image from "next/image";
import { get_content } from "@/apis_reqests/content";

interface Props {
  products: GalleryProps | null;
}

export default function FetchGallery({ products }: Props) {
  const [showLightbox, setShowLightbox] = useState(false);
  const [curIndex, setCurIndex] = useState(0);
  const [allUrls, setAllUrls] = useState<string[]>([]);
  const curIndexRef = useRef(0);
  const allUrlsRef = useRef<string[]>([]);
  const msg = "NENAČETL SE OBRÁZEK, ZKUSTE OBNOVIT STRÁNKU";

  const [galleryTitle, setGalleryTitle] = useState("Naše Galerie");
  const [galleryText, setGalleryText] = useState("Prohlédněte si naši autorskou tvorbu šperků. Každý kousek je originálním spojením umění, precizní práce a ušlechtilých kovů.");

  useEffect(() => {
    (async () => {
      try {
        const content = await get_content();
        if (content) {
          if (content.galleryTitle) setGalleryTitle(content.galleryTitle);
          if (content.galleryText) setGalleryText(content.galleryText);
        }
      } catch (e) {
        console.error("Failed to load gallery content", e);
      }
    })();
  }, []);

  useEffect(() => {
    const urls =
      products?.products.flatMap((product) =>
        product.mediaUrls ? product.mediaUrls.filter((url) => !url.endsWith(".mp4")) : []
      ) || [];
    setAllUrls(urls);
    allUrlsRef.current = urls;
  }, [products]);

  // Keep ref in sync so keyboard handler always has latest values
  useEffect(() => {
    curIndexRef.current = curIndex;
  }, [curIndex]);

  const CloseLightBox = useCallback(() => {
    setShowLightbox(false);
    document.body.style.overflow = "";
  }, []);

  // Index-based navigation (fixes duplicate-URL issue)
  const HandleArrow = useCallback((direction: "next" | "previous") => {
    const urls = allUrlsRef.current;
    if (urls.length === 0) return;
    setCurIndex((prev) => {
      if (direction === "next") {
        return (prev + 1) % urls.length;
      } else {
        return (prev - 1 + urls.length) % urls.length;
      }
    });
  }, []);

  // Handle keyboard events (ESC to close, Left/Right arrows to navigate)
  useEffect(() => {
    if (!showLightbox) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        CloseLightBox();
      } else if (e.key === "ArrowRight") {
        HandleArrow("next");
      } else if (e.key === "ArrowLeft") {
        HandleArrow("previous");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLightbox, CloseLightBox, HandleArrow]);

  const HandleLightBox = useCallback((index: number) => {
    setCurIndex(index);
    setShowLightbox(true);
    document.body.style.overflow = "hidden";
  }, []);

  const curImg = allUrls[curIndex] ?? "";

  return (
    <div className="w-full min-h-screen bg-black text-white pt-28 pb-16 px-4 sm:px-8">
      {/* Title */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
          {galleryTitle}
        </h1>
        <div className="w-24 h-[1px] bg-neutral-500 mx-auto mb-4"></div>
        <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base font-light">
          {galleryText}
        </p>
      </div>

      {/* Main Gallery Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allUrls.map((url, i) => (
          <div
            key={i}
            onClick={() => HandleLightBox(i)}
            className="group relative aspect-square w-full overflow-hidden rounded-none bg-neutral-900 shadow-md cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30 border border-neutral-900"
          >
            <Image
              src={url}
              alt="Autorský šperk"
              fill
              sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 25vw"
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />
            {/* Elegant overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-xs font-light tracking-widest uppercase border border-white px-5 py-2.5 rounded-none backdrop-blur-md transition-all duration-300 group-hover:scale-105 bg-black/70">
                Zobrazit detail
              </span>
            </div>
          </div>
        ))}
      </main>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-between bg-black/95 backdrop-blur-md py-6 px-4 animate-fade-in">
          {/* Lightbox Header */}
          <div className="w-full max-w-6xl flex justify-between items-center px-4 z-10">
            <span className="text-neutral-400 text-sm tracking-wider font-light">
              {curIndex + 1} / {allUrls.length}
            </span>
            <button
              onClick={CloseLightBox}
              className="text-white/70 hover:text-white transition-colors p-2 text-3xl font-light hover:rotate-90 duration-300 cursor-pointer"
              title="Zavřít (Esc)"
            >
              &times;
            </button>
          </div>

          {/* Big Image Display with Navigation Arrows */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center py-4">
            {/* Prev Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                HandleArrow("previous");
              }}
              className="absolute left-4 z-50 text-white/70 hover:text-white transition-all p-4 bg-black/60 hover:bg-black/90 border border-neutral-800 backdrop-blur-sm cursor-pointer hover:scale-105 active:scale-95"
              title="Předchozí (Levá šipka)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Central Image Container */}
            <div className="relative w-full h-full max-h-[70vh] flex justify-center items-center">
              <div className="relative w-[85%] h-full">
                {curImg && (
                  <Image
                    src={curImg}
                    alt={msg}
                    fill
                    className="object-contain select-none"
                    sizes="100vw"
                    priority
                    draggable={false}
                  />
                )}
              </div>
            </div>

            {/* Next Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                HandleArrow("next");
              }}
              className="absolute right-4 z-50 text-white/70 hover:text-white transition-all p-4 bg-black/60 hover:bg-black/90 border border-neutral-800 backdrop-blur-sm cursor-pointer hover:scale-105 active:scale-95"
              title="Další (Pravá šipka)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Thumbnail Bar */}
          <div className="w-full max-w-3xl flex justify-start sm:justify-center items-center gap-3 overflow-x-auto py-4 px-2 no-scrollbar">
            {allUrls.map((url, i) => {
              const isActive = i === curIndex;
              return (
                <button
                  key={i}
                  onClick={() => setCurIndex(i)}
                  className={`relative h-16 w-16 flex-shrink-0 rounded-none overflow-hidden transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-105"
                      : "opacity-40 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={url}
                    alt="Miniatura"
                    fill
                    className="object-cover transition-all duration-300"
                    sizes="64px"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
