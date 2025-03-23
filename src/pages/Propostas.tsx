// src/pages/Propostas.tsx
import React, { useEffect, useState } from 'react';
import { InstagramMosaic } from '../pages/InstagramMosaicv';
import PDFCarousel from '../components/PDFCarousel';

interface Proposta {
  id: string;
  title: string;
  pdfUrl: string;
}

export default function Propostas() {
  const [proposals, setProposals] = useState<Proposta[]>([]);

  useEffect(() => {
    // Função para carregar os PDFs da pasta public/propostas
    const loadProposals = () => {
      try {
        // Criar array de propostas com base nos arquivos da pasta public/propostas
        const proposals: Proposta[] = [
          { id: '1', title: '15 ANOS', pdfUrl: '/propostas/15 ANOS.pdf' },
          { id: '2', title: 'Acompanhamento', pdfUrl: '/propostas/Acompanhamento .pdf' },
          { id: '3', title: 'BATIZADO', pdfUrl: '/propostas/BATIZADO.pdf' },
          { id: '4', title: 'FESTA INFANTIL.2024', pdfUrl: '/propostas/FESTA INFANTIL.2024.pdf' },
          { id: '5', title: 'Fotografia de parto 2025', pdfUrl: '/propostas/Fotografia de parto 2025.pdf' },
          { id: '6', title: 'Proposta_2024', pdfUrl: '/propostas/Proposta_2024.pdf' }
        ];
        setProposals(proposals);
      } catch (error) {
        console.error('Erro ao carregar propostas:', error);
      }
    };

    loadProposals();
  }, []);

  return (
    <div className="min-h-screen relative p-4">
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <InstagramMosaic />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto mt-[10vh] px-6 py-12 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
        <h1 className="text-4xl font-light text-center mb-8">Propostas</h1>
        {proposals.length > 0 ? (
          <PDFCarousel pdfs={proposals} />
        ) : (
          <p className="text-center text-gray-600">Nenhuma proposta encontrada.</p>
        )}
      </div>
    </div>
  );
}
