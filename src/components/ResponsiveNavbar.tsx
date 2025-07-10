import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Camera,
  Calendar,
  Home,
  User,
  FileText,
  Instagram,
  Facebook,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "./Logo";

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { to: "/", icon: <Home className="h-5 w-5" />, label: "Início" },
  { to: "/sobre", icon: <User className="h-5 w-5" />, label: "Sobre" },
  {
    to: "/portfolio",
    icon: <Camera className="h-5 w-5" />,
    label: "Portfólio",
  },
  {
    to: "/propostas",
    icon: <FileText className="h-5 w-5" />,
    label: "Propostas",
  },
  {
    to: "/agendamento",
    icon: <Calendar className="h-5 w-5" />,
    label: "Agendamento",
  },
];

const socialLinks = [
  {
    href: "https://instagram.com",
    icon: <Instagram className="h-5 w-5" />,
    label: "Instagram",
  },
  {
    href: "https://facebook.com",
    icon: <Facebook className="h-5 w-5" />,
    label: "Facebook",
  },
  {
    href: "mailto:contato@gracefotografia.com",
    icon: <Mail className="h-5 w-5" />,
    label: "Email",
  },
];

export function ResponsiveNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Fecha o menu mobile quando a rota muda
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handles para arrastar
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !navRef.current) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX;

    // Permite arrastar horizontalmente no mobile
    if (Math.abs(deltaX) > 10) {
      navRef.current.style.transform = `translateX(${deltaX}px)`;
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (navRef.current) {
      navRef.current.style.transform = "";
    }
  };

  return (
    <>
      {/* Desktop Navbar - lateral esquerda */}
      <nav className="hidden lg:block fixed left-[5%] top-1/2 -translate-y-1/2 w-[9%] bg-white/80 backdrop-blur-sm z-50 rounded-2xl shadow-lg border border-gray-100 py-8 overflow-y-auto max-h-[90vh]">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-center space-y-2">
            <Camera className="h-8 w-8 text-gray-900" />
            <span className="text-xs font-light tracking-wider text-center">
              GraceFotografia
            </span>
          </Link>

          {/* Links Principais */}
          <div className="flex flex-col items-center space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center space-y-1 group transition-colors ${
                  location.pathname === item.to
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[10px] sm:text-xs">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Redes Sociais */}
          <div className="flex flex-col items-center space-y-4 pt-4 border-t border-gray-200 w-full">
            {socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 group"
                aria-label={social.label}
              >
                <div className="group-hover:scale-110 transition-transform">
                  {social.icon}
                </div>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-40 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center space-x-2">
            <Camera className="h-6 w-6 text-gray-900" />
            <span className="text-lg font-medium tracking-wide">
              Grace Fotografia
            </span>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-white h-full w-80 max-w-[80vw] shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <Camera className="h-6 w-6 text-gray-900" />
                  <span className="text-lg font-medium">Grace Fotografia</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.to
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.icon}
                    <span className="text-base font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="pt-8 mt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">Redes Sociais</p>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile/Tablet Bottom Navigation */}
      <nav
        ref={navRef}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-40 safe-area-pb"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1 ${
                location.pathname === item.to
                  ? "text-gray-900 bg-gray-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div
                className={`transition-transform ${location.pathname === item.to ? "scale-110" : ""}`}
              >
                {item.icon}
              </div>
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
