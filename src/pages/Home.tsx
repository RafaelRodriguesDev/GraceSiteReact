// Home.jsx
import React from 'react';
import { InstagramMosaic } from './InstagramMosaicv';

export function Home() {
  return (
    <div className="min-h-screen w-screen relative">
      {/* Mosaico de Fundo */}
      <InstagramMosaic />

      {/* Navbar simples com logo */}
      <nav className="relative z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          {/* Logo */}
          <img
            src="/logo/LG_PRETO.png"
            alt="Grace Fotografia Logo"
            className="h-20 w-auto" // Ajusta o tamanho da logo (altura de 48px)
          />
        </div>
      </nav>
    </div>
  );
}