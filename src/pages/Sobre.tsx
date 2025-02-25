// src/pages/Sobre.tsx
import React from 'react';
import '../global.css';

export function Sobre() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Primeira Seção: Título e Imagem à Direita */}
      <div className="w-[70%] sm:w-[40%] mx-auto mt-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Quem é a Grace?</h1>
        <div className="flex flex-col sm:flex-row items-center justify-between">
          {/* Texto à Esquerda */}
          <div className="text-left sm:w-2/3 pr-2">
           
            <p className="text-lg text-gray-700 mb-4">
            Olá, eu sou a{' '}
            <span className="font-[HappyBirthday4] text-4xl text-pink-600">Grace</span>
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Há 10 anos, transformei minha paixão pela fotografia em meu trabalho.
              Desde muito jovem, fui encantada por essa arte de capturar momentos e, com o tempo, descobri que ela podia mudar vidas.
            </p>
          </div>

          {/* Imagem à Direita */}
          <div className="sm:w-3/3 mt-4 sm:mt-0">
            <img
              src="/background/grace-top-right.png" // Substitua pelo caminho da sua imagem
              alt="Grace"
              className="w-full h-auto rounded-lg  object-cover"
            />
          </div>
        </div>
      </div>

      {/* Segunda Seção: Texto e Imagem à Esquerda */}
      <div className="w-[70%] sm:w-[40%] mx-auto mt-8">
        <div className="flex flex-col sm:flex-row-reverse items-center justify-between">
          {/* Texto à Direita */}
          <div className="text-left sm:w-2/3 pl-4">
            <p className="text-lg text-gray-700 mb-4">
              Meu estilo é marcado pela leveza e por uma estética clean e atemporal, onde o foco principal é você e sua família.
              Cada clique é pensado para contar uma história única, com muita emoção e autenticidade, sem excessos.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Sou filha de mineiros, o que me ensinou a valorizar minhas raízes e a importância da família.
              Amo cachorros, doces, crianças e tudo que celebra a vida ao ar livre — seja a beleza da natureza ou um pôr do sol inspirador.
            </p>
          </div>

          {/* Imagem à Esquerda */}
          <div className="sm:w-2/3 mt-4 sm:mt-0">
            <img
              src="/background/grace-middle-left.png" // Substitua pelo caminho da sua imagem
              alt="Grace"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </div>
      </div>

      {/* Terceira Seção: Texto e Imagem Centralizada */}
      <div className="w-[70%] sm:w-[40%] mx-auto mt-8">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">
            Além de um olhar apurado para os detalhes, sou comprometida com prazos e a excelência nas entregas.
            Para mim, a fotografia vai além do simples clique: ela transforma momentos em memórias eternas.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Convido você a conhecer meu trabalho e descobrir como a magia, a criatividade e o cuidado com cada detalhe podem transformar seus momentos
            especiais em lembranças inesquecíveis.
          </p>

          {/* Imagem Centralizada */}
          <div className="mt-4">
            <img
              src="/background/grace-bottom-center.png" // Substitua pelo caminho da sua imagem
              alt="Grace"
              className="w-full h-auto rounded-lg object-cover "
            />
          </div>
        </div>
      </div>
    </div>
  );
}