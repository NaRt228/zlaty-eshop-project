"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { get_content } from "@/apis_reqests/content";
import defaultImg from '../../utils/images/exampleAbout.jpg';

export default function Page() {
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

  const aboutTitle = content?.aboutTitle || "Jovana Šichová";
  const aboutText = content?.aboutText || "Vytvářím autorské šperky, které v sobě nesou příběh, sílu a harmonii. Každý kousek je vyroben ručně s důrazem na detail, osobitý charakter a kvalitu zpracování. Inspiraci čerpám z přírodních tvarů, mystiky a syrové krásy ušlechtilých kovů.";
  const aboutImageUrl = content?.aboutImageUrl || defaultImg;

  return (
    <div className="w-full min-h-screen bg-black text-white pt-32 pb-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto mt-16 relative">
        {/* Content */}
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-center items-center gap-16">
            
            {/* Image Container with Homepage offset shadow */}
            <div className="relative w-[320px] h-[420px] flex-shrink-0">
              <div className="absolute inset-0 border border-white/20 translate-x-4 translate-y-4 z-0"></div>
              <Image 
                src={aboutImageUrl} 
                fill
                priority
                unoptimized
                alt={`O mně - ${aboutTitle}`}
                draggable={false}
                className="object-cover relative z-10 transition-all duration-700 select-none border border-white/10"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left z-10">
              <h1 className="text-3xl md:text-4xl font-light tracking-widest text-white mb-6 uppercase">
                {aboutTitle}
              </h1>
              <div className="w-20 h-[1px] bg-neutral-500 mb-6 mx-auto md:mx-0"></div>
              <p className="text-neutral-400 text-base md:text-lg font-light leading-relaxed max-w-md whitespace-pre-line">
                {aboutText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
