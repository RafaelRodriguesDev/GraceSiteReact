import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import { PropostasService } from '../services/propostasService';
import { Proposta } from '../types/propostas';

const Propostas: React.FC = () => {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configurações do carrossel
  const itemsPerView = {
    desktop: 3,
    tablet: 2,
    mobile: 1
  };

  useEffect(() => {
    loadPropostas();
  }, []);

  const loadPropostas = async () => {
    try {
      setLoading(true);
      const data = await PropostasService.getPropostasAtivas();
      setPropostas(data);
    } catch (err) {
      setError('Erro ao carregar propostas');
      console.error('Erro ao carregar propostas:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, propostas.length - itemsPerView.desktop);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, propostas.length - itemsPerView.desktop);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDownload = (proposta: Proposta) => {
    const link = document.createElement('a');
    link.href = proposta.arquivo_url;
    link.download = `${proposta.titulo}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando propostas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (propostas.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhuma proposta disponível no momento.</p>
        </div>
      </div>
    );
  }

  const maxIndex = Math.max(0, propostas.length - itemsPerView.desktop);
  const indicators = Array.from({ length: maxIndex + 1 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nossas Propostas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça nossos pacotes fotográficos especializados para cada momento especial da sua vida.
            Cada proposta foi cuidadosamente elaborada para atender suas necessidades específicas.
          </p>
        </div>
      </div>

      {/* Carrossel Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative">
            {/* Carrossel Container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView.desktop)}%)`
                }}
              >
                {propostas.map((proposta) => (
                  <div 
                    key={proposta.id} 
                    className="w-1/3 flex-shrink-0 px-3"
                  >
                    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                      {/* Thumbnail */}
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        {proposta.thumbnail_url ? (
                          <img 
                            src={proposta.thumbnail_url} 
                            alt={proposta.titulo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      
                      {/* Conteúdo */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {proposta.titulo}
                        </h3>
                        
                        {proposta.descricao && (
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {proposta.descricao}
                          </p>
                        )}
                        
                        <button
                          onClick={() => handleDownload(proposta)}
                          className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Baixar Proposta
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Setas de Navegação */}
            {propostas.length > itemsPerView.desktop && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 z-10"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 z-10"
                >
                  <ChevronRight className="h-6 w-6 text-gray-600" />
                </button>
              </>
            )}
          </div>

          {/* Indicadores */}
          {propostas.length > itemsPerView.desktop && (
            <div className="flex justify-center mt-8 gap-2">
              {indicators.map((index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    currentIndex === index ? 'bg-gray-900' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Interessado em alguma proposta?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Entre em contato conosco para mais informações ou para personalizar uma proposta especial para você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
            >
              WhatsApp
            </a>
            <a
              href="/agendamento"
              className="bg-gray-900 text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-semibold"
            >
              Agendar Consulta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Propostas;
