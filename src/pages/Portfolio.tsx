import React from 'react';

export function Portfolio() {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-light text-center mb-8">Portfólio</h1>
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
  );
}