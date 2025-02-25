// InstagramMosaic.jsx
import React, { useState, useEffect } from 'react';

const imagePaths = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
  "/images/image4.jpg",
  "/images/image5.jpg",
  "/images/image6.jpg",
  "/images/image7.jpg",
  "/images/image8.jpg",
  "/images/image9.jpg",
  "/images/image10.jpg"
];

export function InstagramMosaic() {
  const [currentIndex, setCurrentIndex] = useState(0); // Controla a rotação das imagens
  const [hoveredImage, setHoveredImage] = useState<string | null>(null); // Armazena a imagem em destaque no hover
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Armazena a imagem selecionada para visualização ampliada

  // Atualiza o índice a cada 3 segundos para "rotacionar" a ordem das imagens
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % imagePaths.length);
    }, 3000); // Intervalo de 3 segundos
    return () => clearInterval(interval);
  }, []);

  // Cria um array rotacionado para variar a ordem das imagens
  const rotatedImages = [
    ...imagePaths.slice(currentIndex),
    ...imagePaths.slice(0, currentIndex)
  ];

  return (
    <div>
      {/* Modal para visualização ampliada */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-700 ease-in-out"
          style={{ opacity: selectedImage ? 1 : 0 }}
          onClick={() => setSelectedImage(null)} // Fecha o modal ao clicar fora
        >
          <img
            src={selectedImage}
            alt="Ampliada"
            className="max-w-full max-h-screen object-contain cursor-pointer transition-opacity duration-700 ease-in-out"
          />
        </div>
      )}

      {/* Grid de imagens */}
      <div
        className="absolute inset-0 overflow-hidden transition-transform duration-700  ease-[cubic-bezier(0.4, 0, 0.2, 1)]"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '10px',
        }}
      >
        {rotatedImages.map((src, idx) => (
          <div
            key={idx}
            className="relative transition-all duration-700 ease-[cubic-bezier(0.4, 0, 0.2, 1)]"
            onMouseEnter={() => setHoveredImage(src)} // Define a imagem em destaque ao passar o mouse
            onMouseLeave={() => setHoveredImage(null)} // Remove o destaque ao tirar o mouse
            onClick={() => setSelectedImage(src)} // Abre a imagem em tamanho maior ao clicar
          >
            <img
              src={src}
              alt={`Mosaico ${idx}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
                transform: hoveredImage === src ? 'scale(1.2)' : 'scale(1)',
                opacity: hoveredImage === src ? 1 : 0.8,
                transition: 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1), opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: hoveredImage === src ? '0 8px 16px rgba(0, 0, 0, 0.3)' : 'none',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}