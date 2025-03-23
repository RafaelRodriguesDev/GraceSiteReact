// src/pages/Propostas.tsx
import React, { useEffect, useState } from 'react';
import PDFThumbnail from '../components/PDFThumbnail';
import { InstagramMosaic } from '../pages/InstagramMosaicv';

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
      {/* Fundo com InstagramMosaic */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <InstagramMosaic />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto mt-5 px-6 py-12 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
        <h1 className="text-4xl font-light text-center mb-8">Propostas</h1>
        {proposals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {proposals.map((proposta) => (
              <div key={proposta.id} className="border rounded-lg p-4 flex flex-col items-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                {/* PDF Preview */}
                <div className="w-full h-64 mb-4 overflow-hidden rounded border border-gray-200">
                  <PDFThumbnail
                    pdfUrl={proposta.pdfUrl}
                    scale={1.5}
                    className="w-full h-full"
                  />
                </div>
                <div className="text-center">
                  <p className="font-medium text-lg mb-2">{proposta.title}</p>
                  <a
                    href={proposta.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                  >
                    Abrir PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">Nenhuma proposta encontrada.</p>
        )}
      </div>
    </div>
  );
}
