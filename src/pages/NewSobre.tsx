import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Heart,
  Star,
  Users,
  Award,
  ArrowRight,
  Calendar,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function NewSobre() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );
  const sectionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Intersection Observer para animações de entrada
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.2 },
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Autenticidade",
      description:
        "Capturo momentos naturais e emoções verdadeiras, sem artificialidades.",
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Excelência",
      description:
        "Comprometida com a qualidade e pontualidade em cada entrega.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Família",
      description:
        "Valores familiares sólidos e amor genuíno em cada trabalho.",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Qualidade",
      description:
        "Fotos atemporais que resistem ao tempo e criam legados familiares.",
    },
  ];

  const journey = [
    {
      year: "2014",
      title: "Início da Jornada",
      description:
        "Descobri minha paixão pela fotografia e comecei a estudar a arte de capturar momentos.",
    },
    {
      year: "2016",
      title: "Primeiros Trabalhos",
      description:
        "Realizei meus primeiros ensaios familiares, aprendendo a importância da conexão com os clientes.",
    },
    {
      year: "2018",
      title: "Especialização",
      description:
        "Aprofundei meus conhecimentos em fotografia de família e eventos especiais.",
    },
    {
      year: "2020",
      title: "Crescimento",
      description:
        "Expandiu o portfólio e desenvolveu um estilo único e atemporal.",
    },
    {
      year: "2024",
      title: "Presente",
      description:
        "Mais de 500 famílias fotografadas e um legado de momentos eternizados.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('/background/grace-top-right.png')`,
            }}
          />
        </div>

        <div
          className={`relative z-10 text-center px-6 max-w-4xl mx-auto transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img
                src="/background/grace-middle-left.png"
                alt="Grace"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-[HappyBirthday4] text-gray-900 mb-6">
            Olá, eu sou a Grace
          </h1>

          <p className="text-2xl md:text-3xl text-gray-700 mb-6 font-light">
            Fotógrafa especializada em momentos únicos
          </p>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Há mais de 10 anos transformo momentos especiais em memórias
            eternas. Acredito que cada família tem sua própria história para
            contar, e meu papel é capturar essa essência única com autenticidade
            e carinho.
          </p>

          <button
            onClick={() => scrollToSection("minha-historia")}
            className="group inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Conheça minha história
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </section>

      {/* Minha História */}
      <section id="minha-historia" className="py-20 px-6" data-animate>
        <div
          className={`max-w-6xl mx-auto transition-all duration-1000 ${
            visibleSections.has("minha-historia")
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-20"
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Minha História
                </h2>
                <div className="w-16 h-1 bg-gray-900 mb-8"></div>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Sou{" "}
                  <span className="font-semibold text-gray-900">
                    filha de mineiros
                  </span>
                  , e essa origem me ensinou a valorizar as coisas simples e
                  genuínas da vida. Desde pequena, sempre fui encantada pela
                  capacidade de uma fotografia congelar momentos preciosos e
                  contar histórias.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed">
                  O que começou como um hobby se transformou em minha maior
                  paixão. Cada sessão é uma nova descoberta, onde aprendo sobre
                  diferentes famílias, suas dinâmicas únicas e as pequenas
                  coisas que as tornam especiais.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed">
                  Amo cachorros, doces, crianças e tudo que celebra a vida ao ar
                  livre. Essa personalidade calorosa e acolhedora se reflete no
                  meu trabalho, criando um ambiente confortável onde as pessoas
                  podem ser autênticas.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    10+
                  </div>
                  <div className="text-gray-600">Anos de paixão</div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    500+
                  </div>
                  <div className="text-gray-600">Famílias felizes</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/background/grace-middle-left.png"
                  alt="Grace fotografando"
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-8 -right-8 bg-white p-4 rounded-xl shadow-lg transform rotate-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Camera size={20} />
                  <span className="font-semibold">Paixão pela fotografia</span>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-lg transform -rotate-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Heart size={20} />
                  <span className="font-semibold">Momentos autênticos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minha Jornada */}
      <section className="py-20 px-6 bg-gray-50" data-animate>
        <div
          className={`max-w-6xl mx-auto transition-all duration-1000 delay-200 ${
            visibleSections.has("minha-historia")
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-20"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Minha Jornada
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Uma década de crescimento, aprendizado e momentos inesquecíveis
              capturados através das lentes
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-300 hidden lg:block"></div>

            <div className="space-y-12">
              {journey.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full border-4 border-white shadow-lg hidden lg:block"></div>

                  {/* Content */}
                  <div
                    className={`lg:w-1/2 ${index % 2 === 0 ? "lg:pr-12" : "lg:pl-12"}`}
                  >
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meus Valores */}
      <section className="py-20 px-6" data-animate>
        <div
          className={`max-w-6xl mx-auto transition-all duration-1000 delay-400 ${
            visibleSections.has("minha-historia")
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-20"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meus Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Os princípios que guiam cada trabalho e relacionamento que
              construo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-900 transition-colors">
                  <div className="text-gray-700 group-hover:text-white transition-colors">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meu Estilo */}
      <section className="py-20 px-6 bg-gray-50" data-animate>
        <div
          className={`max-w-6xl mx-auto transition-all duration-1000 delay-600 ${
            visibleSections.has("minha-historia")
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-20"
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img
                  src="/background/grace-bottom-center.png"
                  alt="Estilo fotográfico Grace"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent rounded-2xl"></div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Meu Estilo
                </h2>
                <div className="w-16 h-1 bg-gray-900 mb-8"></div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                Meu trabalho é marcado pela{" "}
                <span className="font-semibold">leveza</span> e por uma estética{" "}
                <span className="font-semibold">clean e atemporal</span>.
                Acredito que a verdadeira beleza está na simplicidade e na
                autenticidade.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Naturalidade
                    </h3>
                    <p className="text-gray-600">
                      Capturo momentos espontâneos e genuínos, sem poses
                      forçadas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Conexão
                    </h3>
                    <p className="text-gray-600">
                      Foco na emoção e na conexão entre as pessoas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Atemporalidade
                    </h3>
                    <p className="text-gray-600">
                      Fotos que resistem ao tempo e se tornam legados familiares
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Vamos criar memórias juntos?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Estou sempre pronta para conhecer novas famílias e capturar seus
            momentos únicos. Entre em contato e vamos conversar sobre como posso
            eternizar suas memórias.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={24} />
              </div>
              <p className="text-sm opacity-75">WhatsApp</p>
              <p className="font-semibold">(11) 99999-9999</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} />
              </div>
              <p className="text-sm opacity-75">Email</p>
              <p className="font-semibold">contato@gracefotografia.com</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Instagram size={24} />
              </div>
              <p className="text-sm opacity-75">Instagram</p>
              <p className="font-semibold">@gracefotografia</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
            >
              <Camera size={20} />
              Ver Portfolio
            </Link>

            <Link
              to="/agendamento"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-300"
            >
              <Calendar size={20} />
              Agendar Sessão
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
