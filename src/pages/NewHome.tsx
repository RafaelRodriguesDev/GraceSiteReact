import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Calendar,
  Heart,
  Star,
  ArrowRight,
  Instagram,
  Phone,
  Mail,
} from "lucide-react";
import { MosaicoResponsivo } from "../components/MosaicoResponsivo";
import { Logo } from "../components/Logo";

export function NewHome() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const testimonials = [
    {
      text: "Grace capturou nossa família de forma tão natural e genuína. As fotos ficaram lindas!",
      author: "Maria Silva",
      role: "Mãe de 2 filhos",
    },
    {
      text: "Profissional incrível! Fez nosso casamento ficar ainda mais especial.",
      author: "João e Ana",
      role: "Casal",
    },
    {
      text: "Recomendo de olhos fechados. Qualidade excepcional e carinho em cada foto.",
      author: "Carlos Mendes",
      role: "Pai de família",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="h-screen lg:min-h-screen relative overflow-hidden">
      {/* Background Mosaic */}
      <div className="absolute inset-0 z-0">
        <MosaicoResponsivo
          className="absolute inset-0"
          enableHover={false}
          enableModal={false}
          autoRotate={true}
          rotateInterval={4000}
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]"></div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 h-full overflow-y-auto lg:overflow-visible pb-safe">
        {/* Hero Section */}
        <section className="min-h-screen lg:min-h-screen flex items-center justify-center px-4 py-safe">
          <div
            className={`text-center max-w-4xl mx-auto transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* Logo */}
            <div className="mb-8">
              <Logo size="hero" className="mx-auto mb-4" />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-[HappyBirthday4] text-gray-900 mb-6 leading-tight">
              Momentos Únicos
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-4 font-light">
              Momentos únicos, memórias eternas
            </p>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Especializada em capturar a essência genuína de cada família,
              transformando momentos especiais em lembranças que durarão para
              sempre.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Camera size={20} />
                Ver Portfólio
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                to="/agendamento"
                className="group inline-flex items-center gap-2 border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
              >
                <Calendar size={20} />
                Agendar Sessão
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-gray-900 mb-2">10+</div>
                <div className="text-gray-600 text-sm">Anos de experiência</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  500+
                </div>
                <div className="text-gray-600 text-sm">
                  Famílias fotografadas
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  100%
                </div>
                <div className="text-gray-600 text-sm">
                  Clientes satisfeitos
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="relative z-10 py-20 px-4 bg-white/90 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Nossos Serviços
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Especializamos em capturar os momentos mais preciosos da sua
                vida
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors">
                  <Heart className="h-8 w-8 text-gray-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Ensaio Família
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Momentos únicos em família, capturando o amor e a conexão
                  entre vocês em cenários naturais e acolhedores.
                </p>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors">
                  <Camera className="h-8 w-8 text-gray-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Eventos Especiais
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Casamentos, batizados, aniversários e outras celebrações
                  importantes da sua vida registradas com carinho.
                </p>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors">
                  <Star className="h-8 w-8 text-gray-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Festa Infantil
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  A alegria e espontaneidade das crianças capturadas de forma
                  natural, preservando a magia da infância.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                to="/propostas"
                className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 font-semibold"
              >
                Ver todas as propostas
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative z-10 py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-16">
              O que nossos clientes dizem
            </h2>

            <div className="relative">
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-3xl mx-auto">
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className="text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg md:text-xl text-gray-700 italic leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                </div>
                <div>
                  <cite className="text-gray-900 font-semibold not-italic">
                    {testimonials[currentTestimonial].author}
                  </cite>
                  <p className="text-gray-600 text-sm mt-1">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>

              {/* Testimonial Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial
                        ? "bg-gray-900"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="relative z-10 py-20 px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Pronta para capturar seus momentos especiais?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Entre em contato e vamos conversar sobre como posso transformar
              seus momentos únicos em memórias eternas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/agendamento"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
              >
                <Calendar size={20} />
                Agendar Consulta
              </Link>

              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-300"
              >
                <Phone size={20} />
                WhatsApp
              </a>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="mailto:contato@gracefotografia.com"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
