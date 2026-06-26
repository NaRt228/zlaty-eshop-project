"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faCartShopping,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/contexts/CartContext";

interface NavLink {
  href: string;
  title: string;
  icon?: {
    icon: IconDefinition;
    left?: boolean;
  };
}

export default function Header() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const { cartCount } = useCart();

  const navLinks: NavLink[] = [
    { href: "/", title: "Domů" },
    { href: "/about", title: "O mně" },
    { href: "/galerie", title: "Galerie" },
    { href: "/nakupovat", title: "Nakupovat" },
    { href: "/kosik", title: "Košík", icon: { icon: faCartShopping } },
  ];

  useEffect(() => {
    const handleScroll = () => setHasShadow(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
console.log("wtf");


  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 bg-black/95 backdrop-blur-sm transition-all duration-300 h-24 border-b border-neutral-900 ${
        hasShadow ? "shadow-xl border-neutral-800" : ""
      }`}
    >
      <div className="flex justify-between max-[600px]:gap-10 items-center p-4 container mx-auto h-full">
        <Link href="/" className="text-white text-3xl md:text-4xl font-light tracking-widest uppercase hover:opacity-80 transition z-30">
          Jovana Šichová
        </Link>
        <div className="hidden md:flex space-x-6 gap-3 ">
          {navLinks.map((link, i) => (
            <button key={i} onClick={() => setNavbarOpen(false)}>
              <Link
                href={link.href}
                className="text-lg font-medium text-white hover:text-neutral-400 transition flex items-center gap-x-2 relative"
              >
                {link.title === "Košík" ? (
                  <div className="relative flex items-center">
                    <FontAwesomeIcon icon={link.icon!.icon} />
                    <span className="ml-2">{link.title}</span>
                    {cartCount > 0 && (
                      <div className="absolute -top-2.5 -right-4.5 w-5 h-5 bg-white text-black rounded-full flex items-center justify-center text-[10px] font-mono font-bold border border-black shadow-md">
                        {cartCount}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {link.icon && link.icon.left && (
                      <FontAwesomeIcon icon={link.icon.icon} />
                    )}
                    {link.title}
                    {link.icon && !link.icon.left && (
                      <FontAwesomeIcon icon={link.icon.icon} />
                    )}
                  </>
                )}
              </Link>
            </button>
          ))}
        </div>
       
        <FontAwesomeIcon
          icon={navbarOpen ? faXmark : faBars}
          className="md:!hidden text-2xl cursor-pointer z-10 text-white"
          onClick={() => setNavbarOpen(!navbarOpen)}
        />
      </div>
      {navbarOpen && (
        <div className="relative md:hidden flex flex-col items-end px-8 pb-10 z-50 bg-black/95 border-b border-neutral-900">
          {navLinks.map((link, i) => (
            <button key={i} onClick={() => setNavbarOpen(false)} className="py-2">
              <Link
                href={link.href}
                className="text-lg font-medium text-white hover:text-neutral-400 transition flex items-center"
              >
                {link.icon && link.icon.left && (
                  <FontAwesomeIcon icon={link.icon.icon} />
                )}{" "}
                {link.title.toLocaleLowerCase() === "košík" ? (
                  <div className="relative flex items-center">
                    {link.title}
                    {cartCount > 0 && (
                      <div className="ml-2 w-5 h-5 text-[10px] bg-white text-black rounded-full flex items-center justify-center font-mono font-bold border border-black">
                        {cartCount}
                      </div>
                    )}
                  </div>
                ) : (
                  link.title
                )}{" "}
                {link.icon && !link.icon.left && (
                  <FontAwesomeIcon icon={link.icon.icon} />
                )}
              </Link>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
