"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { get_content } from '@/apis_reqests/content';

const Footer = () => {
  const [width, setWidth] = useState<number>( typeof window !== "undefined" ? window.innerWidth : 0);
  const [contacts, setContacts] = useState({
    contactEmail: "jovanak@seznam.cz",
    contactPhone: "123 456 789",
    contactInstagram: "Instagram"
  });

  useEffect(() => {
    const resize = () => setTimeout(() => { setWidth(window.innerWidth) }, 1);
    window.addEventListener("resize", resize);
    
    // Fetch contact info
    (async () => {
      try {
        const content = await get_content();
        if (content) {
          setContacts({
            contactEmail: content.contactEmail || "jovanak@seznam.cz",
            contactPhone: content.contactPhone || "123 456 789",
            contactInstagram: content.contactInstagram || "Instagram"
          });
        }
      } catch (e) {
        console.error("Failed to load footer contact info", e);
      }
    })();

    return () => {  window.removeEventListener("resize", resize) }
  }, [])

  const getInstagramHref = (val: string) => {
    if (!val) return "#";
    if (val.startsWith("http://") || val.startsWith("https://")) return val;
    return `https://instagram.com/${val.replace(/^@/, '')}`;
  };

  const getInstagramLabel = (val: string) => {
    if (!val) return "Instagram";
    if (val.startsWith("http://") || val.startsWith("https://")) {
      try {
        const url = new URL(val);
        const path = url.pathname.replace(/^\//, '');
        return path || "Instagram";
      } catch {
        return "Instagram";
      }
    }
    return val;
  };

  return (
    <footer className={`relative bg-black border-t border-neutral-900 w-full flex justify-around font-playfair py-20 mt-auto ${width < 600 ? "flex-col items-center gap-[60px]" : ""}`}>
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <h2 className="font-light text-2xl uppercase tracking-widest text-neutral-400">Kontakt</h2>
        <p className="text-neutral-300 font-light">email: {contacts.contactEmail}</p>
        <p className="text-neutral-300 font-light">číslo: {contacts.contactPhone}</p>
      </div>
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <h2 className="font-light text-2xl uppercase tracking-widest text-neutral-400">Sociální sítě</h2>
        <a 
          href={getInstagramHref(contacts.contactInstagram)} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-neutral-300 hover:text-white transition font-light"
        >
          {getInstagramLabel(contacts.contactInstagram)}
        </a>
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
