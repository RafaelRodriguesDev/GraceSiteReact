import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Phone,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PropostasService } from "../services/propostasService";
import { Proposta } from "../types/propostas";
import { Logo } from "../components/Logo";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Button } from "../components/ui/Button";
import { ErrorState } from "../components/ui/EmptyState";

const NewPropostas: React.FC = () => {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    loadPropostas();
  }, []);

  // Auto-play do carrossel
  useEffect(() => {
    if (!isAutoPlaying || propostas.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % propostas.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, propostas.length]);

  const loadPropostas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PropostasService.getPropostasAtivas();
      setPropostas(data);
      // Centraliza no item do meio
      if (data.length > 0) {
        setCurrentIndex(Math.floor(data.length / 2));
      }
    } catch (err) {
      setError("Erro ao carregar propostas");
      console.error("Erro ao carregar propostas:", err);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % propostas.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + propostas.length) % propostas.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const handleDownload = async (proposta: Proposta) => {
    try {
      const link = document.createElement("a");
      link.href = proposta.arquivo_url;
      link.download = `${proposta.titulo}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao baixar proposta:", error);
    }
  };

  const getCarouselItemClass = (index: number) => {
    const diff = index - currentIndex;
    const totalItems = propostas.length;

    // Normaliza a diferença para o range [-totalItems/2, totalItems/2]
    let normalizedDiff = diff;
    if (diff > totalItems / 2) {
      normalizedDiff = diff - totalItems;
    } else if (diff < -totalItems / 2) {
      normalizedDiff = diff + totalItems;
    }

    if (normalizedDiff === 0) {
      return "scale-110 z-20 opacity-100"; // Centro - destaque
    } else if (Math.abs(normalizedDiff) === 1) {
      return "scale-90 z-10 opacity-75"; // Laterais
    } else {
      return "scale-75 z-0 opacity-50"; // Outros
    }
  };

  const getCarouselTransform = () => {
    const baseTranslate = -currentIndex * 25; // 25% por item
    return `translateX(calc(50% + ${baseTranslate}%))`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Carregando propostas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container-safe py-12">
          <ErrorState
            title="Erro ao carregar propostas"
            description={error}
            onRetry={loadPropostas}
          />
        </div>
      </div>
    );
  }

  if (propostas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Em breve</h3>
          <p className="text-gray-600">
            Nossas propostas estarão disponíveis em breve.
          </p>
        </div>
      </div>
    );
  }

  const currentProposta = propostas[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Logo size="lg" className="mx-auto mb-6" />
          </div>

          <h1 className="text-5xl md:text-6xl font-[HappyBirthday4] text-gray-900 mb-6">
            Nossas Propostas
          </h1>
          <div className="w-24 h-1 bg-gray-900 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cada proposta foi cuidadosamente elaborada para capturar os momentos
            únicos da sua vida. Descubra o pacote perfeito para eternizar suas
            memórias mais preciosas.
          </p>
        </div>
      </section>

      {/* Carrossel Section */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Carrossel Container */}
          <div
            className="relative h-[600px] overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div
              className="flex items-center h-full transition-transform duration-700 ease-out"
              style={{
                transform: getCarouselTransform(),
                width: `${propostas.length * 25}%`,
              }}
            >
              {propostas.map((proposta, index) => (
                <div
                  key={proposta.id}
                  className={`w-full max-w-sm mx-auto transition-all duration-700 ease-out ${getCarouselItemClass(index)}`}
                  style={{ flex: "0 0 25%" }}
                >
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                    {/* Thumbnail */}
                    <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                      {proposta.thumbnail_url ? (
                        <img
                          src={proposta.thumbnail_url}
                          alt={proposta.titulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <FileText className="h-20 w-20 text-gray-400" />
                        </div>
                      )}

                      {/* Overlay com informações */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {proposta.titulo}
                        </h3>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-6">
                      {proposta.descricao && (
                        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                          {proposta.descricao}
                        </p>
                      )}

                      <Button
                        onClick={() => handleDownload(proposta)}
                        className="w-full"
                        leftIcon={<Download className="h-4 w-4" />}
                      >
                        Baixar Proposta
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navegação */}
            {propostas.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white z-30"
                  aria-label="Proposta anterior"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white z-30"
                  aria-label="Próxima proposta"
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {/* Indicadores */}
          {propostas.length > 1 && (
            <div className="flex justify-center mt-8 gap-3">
              {propostas.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === index
                      ? "w-8 h-3 bg-gray-900"
                      : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir para proposta ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Proposta em Destaque */}
      {currentProposta && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {currentProposta.titulo}
            </h2>

            {currentProposta.descricao && (
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {currentProposta.descricao}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => handleDownload(currentProposta)}
                size="lg"
                leftIcon={<Download className="h-5 w-5" />}
              >
                Baixar Esta Proposta
              </Button>

              <Button
                as="a"
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
                leftIcon={<Phone className="h-5 w-5" />}
              >
                Falar no WhatsApp
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronta para capturar seus momentos?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Cada proposta é o primeiro passo para eternizar suas memórias mais
            preciosas. Entre em contato e vamos conversar sobre como tornar seus
            sonhos realidade.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={24} />
              </div>
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <p className="text-sm opacity-75">(11) 99999-9999</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="font-semibold mb-2">Agendamento</h3>
              <p className="text-sm opacity-75">Marque sua consulta</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} />
              </div>
              <h3 className="font-semibold mb-2">Propostas</h3>
              <p className="text-sm opacity-75">Personalizadas para você</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as="a"
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
              leftIcon={<Phone className="h-5 w-5" />}
            >
              Chamar no WhatsApp
            </Button>

            <Link to="/agendamento">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Calendar className="h-5 w-5" />}
                rightIcon={<ArrowRight className="h-5 w-5" />}
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                Agendar Consulta
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewPropostas;
