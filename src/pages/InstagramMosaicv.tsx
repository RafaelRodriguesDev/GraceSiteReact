import React, { useState, useEffect } from 'react';

const imagePaths = [
  "/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg",
  "/images/image4.jpg", "/images/image5.jpg", "/images/image6.jpg",
  "/images/image7.jpg", "/images/image8.jpg", "/images/image9.jpg",
  "/images/image10.jpg", "/images/image11.jpg", "/images/image12.jpg",
  "/images/image13.jpg", "/images/image14.jpg", "/images/image15.jpg",
  "/images/image16.jpg", "/images/image17.jpg", "/images/image18.jpg",
  "/images/image19.jpg", "/images/image20.jpg", "/images/image21.jpg",
  "/images/image22.jpg", "/images/image23.jpg", "/images/image24.jpg",
  "/images/image25.jpg"
];

export function InstagramMosaic() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % imagePaths.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const visibleImages = imagePaths
    .slice(currentIndex)
    .concat(imagePaths.slice(0, currentIndex))
    .slice(0, 10);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-gray-100">
      {/* Modal de visualização ampliada */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Ampliada"
            className="max-w-full max-h-screen object-contain cursor-pointer transition-opacity duration-700 ease-in-out"
          />
        </div>
      )}

      {/* Grid responsivo */}
      <div
        className="grid-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', // Se adapta ao espaço
          gap: '10px',
          width: '100vw', // Garante que ocupe toda a largura da tela
          maxWidth: '100%', // Evita que o grid ultrapasse a tela
          minHeight: '100vh', // Mantém o mínimo da tela para evitar espaços vazios
          padding: '20px'
        }}
      >
        {visibleImages.map((src, idx) => (
          <div
            key={idx}
            className="relative"
            onMouseEnter={() => setHoveredImage(src)}
            onMouseLeave={() => setHoveredImage(null)}
            onClick={() => setSelectedImage(src)}
          >
            <img
              src={src}
              alt={`Mosaico ${idx}`}
              style={{
                width: '100%',
                height: '90%',
                objectFit: 'cover',
                borderRadius: '8px',
                transform: hoveredImage === src ? 'scale(1.1)' : 'scale(1)',
                opacity: hoveredImage === src ? 1 : 0.9,
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
