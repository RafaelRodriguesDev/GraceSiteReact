// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Calendar, Home, Instagram, Facebook, Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa'; // Importando o ícone do WhatsApp

export function Navbar() {
  return (
    <nav className="fixed left-[5%] top-1/2 -translate-y-1/2 w-[9%] bg-white/80 backdrop-blur-sm z-50 rounded-2xl shadow-lg border border-gray-100 py-8 overflow-y-auto max-h-[90vh]">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center space-y-2">
          <Camera className="h-8 w-8 text-gray-900" />
          <span className="text-xs font-light tracking-wider text-center sm:text-sm">GraceFotografia</span>
        </Link>

        {/* Links Principais */}
        <div className="flex flex-col items-center space-y-4">
          <Link to="/" className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900 group">
            <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] sm:text-xs">Início</span>
          </Link>
          <Link to="/portfolio" className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900 group">
            <Camera className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] sm:text-xs">Portfólio</span>
          </Link>
          <Link to="/agendamento" className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900 group">
            <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] sm:text-xs">Agendamento</span>
          </Link>
        </div>

        {/* Redes Sociais */}
        <div className="flex flex-col items-center space-y-4 pt-4 border-t border-gray-200 w-full">
          <a href="https://www.instagram.com/gracefotografia_/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 group">
            <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </a>
          <a href="https://web.facebook.com/gracefotografias" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 group">
            <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </a>
          <a href="mailto:contato@gracefotografia.com" className="text-gray-600 hover:text-gray-900 group">
            <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </a>
               {/* WhatsApp */}
          <a href="https://wa.me/5515981055169" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600 group">
            <FaWhatsapp className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </nav>
  );
}