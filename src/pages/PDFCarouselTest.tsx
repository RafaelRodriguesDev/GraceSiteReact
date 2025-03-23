import React from 'react';
import PDFCarousel from '../components/PDFCarousel';

const formatTitle = (title: string) => {
  return title
    .replace(/[-_]/g, ' ')  // Replace hyphens and underscores with spaces
    .replace(/\..*$/, '')   // Remove file extensions
    .trim();
};

export default function PDFCarouselTest() {
  const testPdfs = [
    { id: '1', title: formatTitle('15 ANOS'), pdfUrl: '/propostas/15 ANOS.pdf' },
    { id: '2', title: formatTitle('Acompanhamento'), pdfUrl: '/propostas/Acompanhamento .pdf' },
    { id: '3', title: formatTitle('BATIZADO'), pdfUrl: '/propostas/BATIZADO.pdf' },
    { id: '4', title: formatTitle('FESTA INFANTIL.2024'), pdfUrl: '/propostas/FESTA INFANTIL.2024.pdf' },
    { id: '5', title: formatTitle('Fotografia de parto 2025'), pdfUrl: '/propostas/Fotografia de parto 2025.pdf' },
    { id: '6', title: formatTitle('Proposta_2024'), pdfUrl: '/propostas/Proposta_2024.pdf' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-light text-center mb-8">Propostas Atuais</h2>
          <PDFCarousel pdfs={testPdfs} />
        </div>
      </div>
    </div>
  );
}