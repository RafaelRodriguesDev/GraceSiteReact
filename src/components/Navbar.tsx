import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Instagram, MessageCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed left-[15%] top-0 h-full w-[280px] bg-white/95 backdrop-blur-sm shadow-lg flex flex-col items-center py-12 px-8 z-50">
      {/* Logo */}
      <div className="mb-12">
        <img src="../src/assets/img/logo_transparente.png" alt="Logo" className="mx-auto mb-4" />
        <h1 className="text-2xl font-light text-gray-800 text-center"></h1>
      </div>

      {/* Links de navegação */}
      <div className="flex flex-col space-y-6 items-center w-full">
        <Link
          to="/"
          className="text-lg font-light text-gray-500 hover:text-rose-400 transition-colors uppercase tracking-wide"
        >
          Início
        </Link>
        <Link
          to="/sobre"
          className="text-lg font-light text-gray-500 hover:text-rose-400 transition-colors uppercase tracking-wide"
        >
          Sobre Mim
        </Link>
        <Link
          to="/agendar"
          className="text-lg font-light text-gray-500 hover:text-rose-400 transition-colors uppercase tracking-wide"
        >
          Orçamento
        </Link>
        <Link
          to="/produtos"
          className="text-lg font-light text-gray-500 hover:text-rose-400 transition-colors uppercase tracking-wide"
        >
          Produtos
        </Link>
        <Link
          to="/contato"
          className="text-lg font-light text-gray-500 hover:text-rose-400 transition-colors uppercase tracking-wide"
        >
          Contato
        </Link>
      </div>

      {/* Social links */}
      <div className="mt-auto flex space-x-4">
        <a href="#" className="text-gray-500 hover:text-rose-400 transition-colors">
          <Instagram size={20} />
        </a>
        <a href="#" className="text-gray-500 hover:text-rose-400 transition-colors">
          <MessageCircle size={20} />
        </a>
      </div>
    </nav>
  );
}

export default Navbar;