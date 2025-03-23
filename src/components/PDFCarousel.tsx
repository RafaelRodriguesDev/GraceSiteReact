import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PDFThumbnail from './PDFThumbnail';

interface PDFCarouselProps {
  pdfs: Array<{
    id: string;
    title: string;
    pdfUrl: string;
  }>;
}

export default function PDFCarousel({ pdfs }: PDFCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePdfClick = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === pdfs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? pdfs.length - 1 : prevIndex - 1
    );
  };

  const getVisiblePdfs = () => {
    const prev = currentIndex === 0 ? pdfs.length - 1 : currentIndex - 1;
    const next = currentIndex === pdfs.length - 1 ? 0 : currentIndex + 1;
    return [prev, currentIndex, next];
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[420px] md:h-[600px] overflow-hidden">
      <div className="flex items-center justify-center h-full">
        {getVisiblePdfs().map((index, i) => (
          <div
            key={pdfs[index].id}
            className={`absolute transition-all duration-500 ease-in-out 
              w-[200px] sm:w-[280px] md:w-[400px] 
              h-[275px] sm:h-[385px] md:h-[550px]
              ${i === 0 ? 'left-0 -translate-x-1/4 opacity-60 scale-[0.85] sm:scale-90' : ''}
              ${i === 1 ? 'left-1/2 -translate-x-1/2 z-20' : ''}
              ${i === 2 ? 'right-0 translate-x-1/4 opacity-60 scale-[0.85] sm:scale-90' : ''}
            `}
          >
            <div className="w-full h-full bg-white rounded-lg shadow-xl overflow-hidden">
              <PDFThumbnail
                pdfUrl={pdfs[index].pdfUrl}
                className="w-full h-full"
              />
              <div 
                className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 sm:p-4 cursor-pointer hover:bg-black/70 transition-colors"
                onClick={() => handlePdfClick(pdfs[index].pdfUrl)}
              >
                <h3 className="text-center text-sm sm:text-base font-medium">{pdfs[index].title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full z-30"
      >
        <FaChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full z-30"
      >
        <FaChevronRight size={24} />
      </button>
    </div>
  );
}