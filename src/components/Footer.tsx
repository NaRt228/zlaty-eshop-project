import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="relative bg-Footer w-full flex justify-around bg-cover font-playfair py-20 mt-auto">
      {/* Top gradient overlay for the persiflage effect */}
      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/90 to-transparent h-20"></div>

      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-4xl">Kontaktuj</h2>
        <p>email: jovanak@seznam.cz</p>
        <p>číslo: 123 456 789</p>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-4xl">Sociální sitě</h2>
        <p>Instagram</p>
      </div>
      <div className="flex flex-col gap-3">
        <Link href={'/'}><p>Domu</p></Link>
        <Link href={'/about'}><p>O mně</p></Link>
        <Link href={'/shop'}><p>Nakupovat</p></Link>
        <Link href={'/galerie'}><p>Galerie</p></Link>
      </div>
    </footer>
  );
};

export default Footer;
