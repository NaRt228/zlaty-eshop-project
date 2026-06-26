"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Footer = () => {
  const [width, setWidth] = useState<number>( typeof window !== "undefined" ? window.innerWidth : 0);
    useEffect(() => {
      const resize = () => setTimeout(() => { setWidth(window.innerWidth) }, 1);
      window.addEventListener("resize", resize)
      return () => {  window.removeEventListener("resize", resize) }
    }, [])
  return (
    <footer className={`relative bg-black border-t border-neutral-900 w-full flex justify-around font-playfair py-20 mt-auto ${width < 600 ? "flex-col items-center gap-[60px]" : ""}`}>
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <h2 className="font-light text-2xl uppercase tracking-widest text-neutral-400">Kontakt</h2>
        <p className="text-neutral-300 font-light">email: jovanak@seznam.cz</p>
        <p className="text-neutral-300 font-light">číslo: 123 456 789</p>
      </div>
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <h2 className="font-light text-2xl uppercase tracking-widest text-neutral-400">Sociální sítě</h2>
        <a href="#" className="text-neutral-300 hover:text-white transition font-light">Instagram</a>
      </div>
      {width >= 600 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-light text-2xl uppercase tracking-widest text-neutral-400">Menu</h2>
          <Link href={'/'} className="text-neutral-300 hover:text-white transition font-light">Domů</Link>
          <Link href={'/about'} className="text-neutral-300 hover:text-white transition font-light">O mně</Link>
          <Link href={'/nakupovat'} className="text-neutral-300 hover:text-white transition font-light">Nakupovat</Link>
          <Link href={'/galerie'} className="text-neutral-300 hover:text-white transition font-light">Galerie</Link>
        </div>
      )}
    </footer>
  );
};

export default Footer;
