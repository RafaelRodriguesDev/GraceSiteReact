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

    // Para poucos itens (4-7), ajustar estratégia
    if (totalItems <= 7) {
      if (index === currentIndex) {
        return "scale-110 z-30 opacity-100"; // Centro - destaque moderado
      } else if (Math.abs(diff) === 1) {
        return "scale-95 z-20 opacity-90"; // Laterais próximas
      } else {
        return "scale-85 z-10 opacity-70"; // Outros
      }
    }

    // Para muitos itens, usar lógica circular
    let normalizedDiff = diff;
    if (diff > totalItems / 2) {
      normalizedDiff = diff - totalItems;
    } else if (diff < -totalItems / 2) {
      normalizedDiff = diff + totalItems;
    }

    if (normalizedDiff === 0) {
      return "scale-125 z-30 opacity-100"; // Centro
    } else if (Math.abs(normalizedDiff) === 1) {
      return "scale-85 z-20 opacity-80"; // Laterais
    } else {
      return "scale-75 z-10 opacity-40 hidden lg:block"; // Outros
    }
  };

  const getCarouselTransform = () => {
    const totalItems = propostas.length;

    // Para poucos itens, centralizar melhor
    if (totalItems <= 7) {
      const itemWidth = 100 / Math.min(totalItems, 3); // Máximo 3 visíveis
      const centerOffset = (100 - itemWidth * Math.min(totalItems, 3)) / 2;
      const baseTranslate = -currentIndex * itemWidth + centerOffset;
      return `translateX(${baseTranslate}%)`;
    }

    // Para muitos itens, usar lógica original
    const baseTranslate = -currentIndex * 33.33;
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white hide-scrollbar">
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
            className="relative h-[600px] overflow-hidden flex items-center justify-center"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div
              className={`flex items-center h-full transition-transform duration-700 ease-out ${
                propostas.length <= 7 ? "gap-6" : ""
              }`}
              style={{
                transform: getCarouselTransform(),
                width:
                  propostas.length <= 7
                    ? `${propostas.length * 340}px`
                    : `${propostas.length * 33.33}%`,
                justifyContent: propostas.length <= 7 ? "flex-start" : "center",
              }}
            >
              {propostas.map((proposta, index) => (
                <div
                  key={proposta.id}
                  className={`w-full max-w-sm transition-all duration-700 ease-out ${getCarouselItemClass(index)} ${
                    propostas.length <= 7 ? "flex-shrink-0" : "mx-auto"
                  }`}
                  style={{
                    flex: propostas.length <= 7 ? "0 0 auto" : "0 0 33.33%",
                    width: propostas.length <= 7 ? "320px" : "auto",
                  }}
                >
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                    {/* Thumbnail com overlay */}
                    <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 group/card">
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

                      {/* Overlay com botão */}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 md:group-hover/card:opacity-100 md:transition-all md:duration-300 flex items-center justify-center
                                      /* Mobile: sempre visível */
                                      md:opacity-0 opacity-100"
                      >
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(proposta);
                          }}
                          variant="secondary"
                          leftIcon={<Download className="h-4 w-4" />}
                          className="transform md:-translate-y-2 md:group-hover/card:translate-y-0 md:transition-transform md:duration-300 translate-y-0"
                        >
                          Baixar Proposta
                        </Button>
                      </div>

                      {/* Título discreto */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg font-bold text-white drop-shadow-lg">
                          {proposta.titulo}
                        </h3>
                      </div>
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

      {/* Seção com WhatsApp e Agendamento */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as="a"
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              leftIcon={<Phone className="h-5 w-5" />}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Falar no WhatsApp
            </Button>

            <Link to="/agendamento">
              <Button
                size="lg"
                leftIcon={<Calendar className="h-5 w-5" />}
                rightIcon={<ArrowRight className="h-5 w-5" />}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                Agendar Consulta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronta para capturar seus momentos?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Cada proposta é o primeiro passo para eternizar suas mem��rias mais
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

          <div className="flex justify-center">
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
