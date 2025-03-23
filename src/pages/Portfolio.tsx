import React from 'react';
import { InstagramMosaic } from './InstagramMosaicv'; // Importa o componente InstagramMosaic

export function Portfolio() {
  return (
        <div className="min-h-screen flex flex-col items-center relative">
          {/* Fundo com InstagramMosaic */}
          <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
            <InstagramMosaic />
          </div>
    
          <div className="relative z-10 w-full max-w-[800px] mx-auto mt-5 px-6 py-12 bg-white rounded-lg shadow-lg">
            <div className="max-w-2xl mx-auto px-4 py-12">
            
            <h1 className="text-3xl font-light text-center mb-4">Portfólio</h1>
            <div className="aspect-square w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
              <iframe
                src="https://www.instagram.com/gracefotografia_/embed"
                className="w-full h-full border-none"
                title="Instagram Feed"
                allowTransparency={true}
                allowFullScreen={true}
              />
            </div>
          </div>
        </div>
    </div>

  );
}