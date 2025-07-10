import { useState, useEffect } from 'react';
import { Camera, Heart, Star, Users, Award, ArrowRight } from 'lucide-react';

export function Sobre() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/background/grace-top-right.png" 
            alt="Grace Fotografia"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100/80 to-white/80"></div>
        </div>
        
        <div className={`relative z-10 text-center px-6 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-6xl md:text-8xl font-[HappyBirthday4] text-gray-800 mb-6">
            Grace
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-light">
            Transformando momentos em memórias eternas
          </p>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Fotógrafa especializada em capturar a essência única de cada família
          </p>
          <button 
            onClick={() => scrollToSection('historia')}
            className="inline-flex items-center gap-2 bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-gray-900 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Conheça minha história
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Minha História */}
      <section id="historia" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Minha História
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Há <span className="font-semibold text-gray-800">10 anos</span>, transformei minha paixão pela fotografia em meu propósito de vida. 
                O que começou como um hobby se tornou uma jornada de descobertas, onde cada 
                clique me ensinou algo novo sobre a arte de eternizar momentos especiais.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Desde muito jovem, fui encantada pela magia de congelar o tempo em uma imagem. 
                Com o passar dos anos, descobri que a fotografia não apenas captura momentos - 
                ela tem o poder de transformar vidas e criar legados familiares.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Camera size={24} />
                  <span className="font-semibold">10 anos de experiência</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/background/grace-middle-left.png" 
                alt="Grace fotografando"
                className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 text-gray-700">
                  <Heart size={20} />
                  <span className="font-semibold">Paixão pela fotografia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meu Estilo */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Meu Estilo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Meu trabalho é marcado pela leveza e por uma estética clean e atemporal. 
              Acredito que a verdadeira beleza está na simplicidade e na autenticidade.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img 
                src="/background/grace-bottom-center.png" 
                alt="Estilo fotográfico Grace"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="text-gray-700" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800">Estética Clean</h3>
                </div>
                <p className="text-gray-600">
                  Cada sessão é única, pensada especialmente para você e sua família. 
                  Meu foco é capturar a essência natural de cada momento.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-gray-700" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800">Foco na Família</h3>
                </div>
                <p className="text-gray-600">
                  Sem artificialidades, com muito amor e cuidado em cada detalhe. 
                  O protagonista é sempre você e sua história única.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="text-gray-700" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800">Qualidade Atemporal</h3>
                </div>
                <p className="text-gray-600">
                  Fotos que resistem ao tempo, mantendo sua beleza e emoção 
                  por gerações, criando um verdadeiro legado familiar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores e Personalidade */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/background/bk5.jpg" 
            alt="Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Meus Valores
          </h2>
          
          <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              Sou filha de <span className="font-semibold text-gray-800">mineiros</span>, o que me ensinou a valorizar minhas raízes 
              e a importância da família. Amo cachorros, doces, crianças e tudo que celebra 
              a vida ao ar livre — seja a beleza da natureza ou um pôr do sol inspirador.
            </p>
            
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
              Além de um olhar apurado para os detalhes, sou comprometida com prazos e 
              a excelência nas entregas. Para mim, a fotografia vai além do simples clique: 
              ela transforma momentos em memórias eternas.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Heart className="text-gray-700" size={32} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Família</h3>
                <p className="text-gray-600 text-sm">Valores familiares sólidos e amor genuíno</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Star className="text-gray-700" size={32} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Excelência</h3>
                <p className="text-gray-600 text-sm">Comprometimento com qualidade e prazos</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Camera className="text-gray-700" size={32} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Autenticidade</h3>
                <p className="text-gray-600 text-sm">Momentos naturais e emoções verdadeiras</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Vamos criar memórias juntos?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Convido você a conhecer meu trabalho e descobrir como a magia, 
            a criatividade e o cuidado com cada detalhe podem transformar seus 
            momentos especiais em lembranças inesquecíveis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-gray-800 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg">
               Ver Portfolio
             </button>
             <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-colors duration-300">
               Agendar Sessão
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}