import React, { useState, useEffect } from "react";
import { MosaicoService, MosaicoImage } from "../services/mosaicoService";

// Fallback images para quando não houver imagens do banco
const fallbackImages = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
  "/images/image4.jpg",
  "/images/image5.jpg",
  "/images/image6.jpg",
  "/images/image7.jpg",
  "/images/image8.jpg",
  "/images/image9.jpg",
  "/images/image10.jpg",
];

interface MosaicoResponsivoProps {
  className?: string;
  enableHover?: boolean;
  enableModal?: boolean;
  autoRotate?: boolean;
  rotateInterval?: number;
}

export function MosaicoResponsivo({
  className = "",
  enableHover = true,
  enableModal = true,
  autoRotate = true,
  rotateInterval = 3000,
}: MosaicoResponsivoProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Carregar imagens do banco ou usar fallback
  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const mosaicoImages = await MosaicoService.getAllImages();

        if (mosaicoImages.length > 0) {
          setImages(mosaicoImages.map((img) => img.url));
        } else {
          // Usar imagens fallback se não houver no banco
          setImages(fallbackImages);
        }
      } catch (error) {
        console.error("Erro ao carregar imagens do mosaico:", error);
        // Em caso de erro, usar imagens fallback
        setImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  // Auto rotação das imagens
  useEffect(() => {
    if (!autoRotate || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, images.length]);

  // Criar array rotacionado
  const rotatedImages =
    images.length > 0
      ? [...images.slice(currentIndex), ...images.slice(0, currentIndex)]
      : [];

  if (loading) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <div className="w-full h-full bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Modal para visualização ampliada */}
      {enableModal && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Imagem ampliada"
            className="max-w-full max-h-full object-contain cursor-pointer transition-all duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all"
          >
            ×
          </button>
        </div>
      )}

      {/* Grid responsivo de imagens */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="grid gap-1 sm:gap-2 h-full w-full"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
            gridAutoRows: "minmax(80px, 1fr)",
          }}
        >
          {rotatedImages.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className={`relative overflow-hidden rounded transition-all duration-500 ease-out ${
                enableHover ? "cursor-pointer hover:z-10" : ""
              }`}
              onMouseEnter={() => enableHover && setHoveredImage(src)}
              onMouseLeave={() => enableHover && setHoveredImage(null)}
              onClick={() => enableModal && setSelectedImage(src)}
            >
              <img
                src={src}
                alt={`Mosaico ${idx}`}
                className="w-full h-full object-cover transition-all duration-500 ease-out"
                style={{
                  transform:
                    enableHover && hoveredImage === src
                      ? "scale(1.1)"
                      : "scale(1)",
                  opacity: enableHover && hoveredImage === src ? 1 : 0.85,
                  filter:
                    enableHover && hoveredImage === src
                      ? "brightness(1.1)"
                      : "brightness(1)",
                }}
                loading="lazy"
                onError={(e) => {
                  // Em caso de erro ao carregar a imagem, usar uma imagem placeholder
                  e.currentTarget.src = "/images/placeholder.jpg";
                }}
              />
              {enableHover && hoveredImage === src && (
                <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
