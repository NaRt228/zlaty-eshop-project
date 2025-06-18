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
import HeaderImage from "../utils/images/Footer.jpg";
import { get_products_cart } from "@/apis_reqests/products";
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
      className={`relative top-0 left-0 w-full z-50 bg-center transition-shadow duration-300 h-24 ${
        hasShadow ? "shadow-lg" : ""
      }`}
      style={{ backgroundImage: `url(${HeaderImage.src})` }}
    >
      <div className="absolute inset-x-0 bottom-[-30px] bg-gradient-to-t from-black/100 to-transparent h-20"></div>

      <div className="flex justify-between items-center p-4 container mx-auto">
        <Link href="/" className="text-white text-5xl">
          Jovana Šichová
        </Link>

        <div className="hidden md:flex space-x-6 gap-3">
          {navLinks.map((link, i) => (
            <button key={i} onClick={() => setNavbarOpen(false)}>
              <Link
                href={link.href}
                className="text-lg font-medium text-white hover:text-blue-500 transition flex items-center gap-x-2 relative"
              >
                {link.title === "Košík" ? (
                  <div className="relative flex items-center">
                    <FontAwesomeIcon icon={link.icon!.icon} />
                    <span className="ml-2">{link.title}</span>
                    {cartCount > 0 && (
                      <div className="absolute -top-2 -right-3 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                        <p className="text-[17px] text-white mb-[8px]">
                          {cartCount}
                        </p>
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
            className="md:!hidden text-2xl cursor-pointer"
            onClick={() => setNavbarOpen(!navbarOpen)}
          />
      </div>

      {navbarOpen && (
        <div className="relative md:hidden flex flex-col items-end px-8 pb-4 z-50">
          {navLinks.map((link, i) => (
            <button key={i} onClick={() => setNavbarOpen(false)}>
              <Link
                href={link.href}
                className="text-lg font-medium text-white hover:text-blue-500 transition flex items-center"
              >
                {link.icon && link.icon.left && (
                  <FontAwesomeIcon icon={link.icon.icon} />
                )}{" "}
                {link.title}{" "}
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
