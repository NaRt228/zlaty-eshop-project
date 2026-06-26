"use client";
import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { get_products } from "@/apis_reqests/products";
import { Product_cart } from "@/interface/product_cart";
import "./Slider.css";

export const Slider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    dragFree: true,
    align: "start"
  });
  const [products, setProducts] = useState<Product_cart[]>([]);

  // Duplicate slides if products count is small to allow Embla's loop to function properly
  const slidesToRender = products.length > 0 && products.length < 12
    ? Array.from({ length: Math.ceil(12 / products.length) }).flatMap(() => products)
    : products;

  useEffect(() => {
    async function fetchProducts() {
      const res = await get_products();
      if (res && res.products) {
        // Filter out products without media or use placeholder if empty
        setProducts(res.products);
      }
    }
    fetchProducts();
  }, []);

  // Autoplay / Continuous auto-scroll functionality
  useEffect(() => {
    if (!emblaApi || products.length === 0) return;

    const startIndex = products.length;
    emblaApi.reInit({ startIndex });

    let isPlaying = false;
    let requestRef = 0;
    let timeoutId: NodeJS.Timeout;

    const play = () => {
      if (!isPlaying) return;

      // Scrolling speed (adjust as needed, positive value scrolls left-to-right)
      const speed = 0.55;

      const engine = emblaApi.internalEngine();
      engine.location.add(speed);
      engine.target.set(engine.location);
      engine.offsetLocation.set(engine.location);
      engine.scrollLooper.loop(speed > 0 ? 1 : -1);
      engine.translate.to(engine.offsetLocation.get());
      engine.slideLooper.loop();

      requestRef = requestAnimationFrame(play);
    };

    const start = () => {
      if (isPlaying) return;
      isPlaying = true;
      requestRef = requestAnimationFrame(play);
    };

    const stop = () => {
      isPlaying = false;
      cancelAnimationFrame(requestRef);
    };

    // Pause on pointer down/drag
    emblaApi.on("pointerDown", () => {
      stop();
      clearTimeout(timeoutId);
    });

    // Resume scrolling after releasing drag/touch
    emblaApi.on("pointerUp", () => {
      clearTimeout(timeoutId);
      // Wait 1.5 seconds before resuming auto-scroll
      timeoutId = setTimeout(() => {
        if (!emblaApi.internalEngine().dragHandler.pointerDown()) {
          start();
        }
      }, 1500);
    });

    // Start auto-scrolling
    start();

    return () => {
      stop();
      clearTimeout(timeoutId);
    };
  }, [emblaApi, products]);

  return (
    <section className="slider-container relative overflow-hidden bg-black text-white py-16 border-y border-neutral-900">
      {/* Title */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 mb-12 text-center sm:text-left">
        <h2 className="text-2xl md:text-3xl font-light tracking-widest uppercase mb-3">
          Vybrané šperky
        </h2>
        <div className="w-16 h-[1px] bg-neutral-700 mx-auto sm:mx-0"></div>
      </div>

      {/* Embla Viewport */}
      {products.length > 0 ? (
        <div className="embla relative z-10 max-w-7xl mx-auto px-4" ref={emblaRef}>
          <div className="embla__container">
            {slidesToRender.map((product, index) => {
              const mainImage = product.mediaUrls && product.mediaUrls.length > 0 
                ? product.mediaUrls[0] 
                : "/placeholder.png";

              return (
                <div className="embla__slide" key={`${product.id}-${index}`}>
                  <Link href={`/nakupovat/${product.id}`} className="block">
                    <div className="slider-item">
                      <div className="slider-img">
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          sizes="(max-w-768px) 260px, 320px"
                          draggable={false}
                          className="object-cover select-none"
                        />
                      </div>
                      <div className="text-info-slider-item">
                        <h3>{product.name}</h3>
                        <p>{product.price.toLocaleString("cs-CZ")} Kč</p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="relative z-10 text-center py-12 text-neutral-400 font-light">
          Načítání produktů...
        </div>
      )}
    </section>
  );
};
