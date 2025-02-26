import React from 'react';
import { InstagramMosaic } from './InstagramMosaicv'; // Importa o componente InstagramMosaic

export function Sobre() {
  return (
    <div className="min-h-screen flex flex-col items-center relative">
      {/* Fundo com InstagramMosaic */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <InstagramMosaic />
      </div>

      {/* Conteúdo da Página com Fundo Branco */}
      <div className="relative z-10 w-full max-w-[800px] mx-auto mt-10 px-6 py-12 bg-white rounded-lg shadow-lg">
        {/* Primeira Seção */}
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Texto */}
          <div className="sm:w-1/2 text-lg leading-relaxed">
            <p>Olá, eu sou a{' '}
              <span className="font-[HappyBirthday4] text-4xl text-pink-600 transition-transform duration-300 hover:scale-105">Grace</span>.
            </p>
            <p className="mt-5">
              Há 10 anos, transformei minha paixão pela fotografia em meu trabalho.
              Desde muito jovem, fui encantada por essa arte de capturar momentos e, com o tempo, descobri que ela podia mudar vidas.
            </p>
          </div>
          {/* Imagem */}
          <div className="sm:w-2/2">
            <img 
              src="/background/grace-top-right.png" 
              alt="Grace"
              className="w-full h-auto rounded-lg transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn"
            />
          </div>
        </div>
      </div>

      {/* Segunda Seção */}
      <div className="relative z-10 w-full -mt-20 max-w-[800px] mx-auto px-6 py-12 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row-reverse items-center gap-8">
          {/* Texto */}
          <div className="sm:w-1/2 text-lg leading-relaxed">
            <p>
              Meu estilo é marcado pela leveza e por uma estética clean e atemporal, onde o foco principal é você e sua família.
              Cada clique é pensado para contar uma história única, com muita emoção e autenticidade, sem excessos.
            </p>
            <p className="mt-4">
              Sou filha de mineiros, o que me ensinou a valorizar minhas raízes e a importância da família.
              Amo cachorros, doces, crianças e tudo que celebra a vida ao ar livre — seja a beleza da natureza ou um pôr do sol inspirador.
            </p>
          </div>
          {/* Imagem */}
          <div className="sm:w-1/2">
            <img 
              src="/background/grace-middle-left.png" 
              alt="Grace"
              className="w-full h-auto rounded-lg transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn"
            />
          </div>
        </div>
      </div>

      {/* Terceira Seção */}
      <div className="relative z-10 w-full -mt-20 max-w-[800px] mx-auto px-6 py-12 text-center bg-white rounded-lg shadow-lg">
        <p className="text-lg leading-relaxed">
          Além de um olhar apurado para os detalhes, sou comprometida com prazos e a excelência nas entregas.
          Para mim, a fotografia vai além do simples clique: ela transforma momentos em memórias eternas.
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          Convido você a conhecer meu trabalho e descobrir como a magia, a criatividade e o cuidado com cada detalhe podem transformar seus momentos
          especiais em lembranças inesquecíveis.
        </p>
        {/* Imagem Centralizada */}
        <div className="mt-6">
          <img 
            src="/background/grace-bottom-center.png" 
            alt="Grace"
            className="w-full max-w-[500px] mx-auto h-auto rounded-lg transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn"
          />
        </div>
      </div>
    </div>
  );
}