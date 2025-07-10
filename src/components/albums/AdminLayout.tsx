import React from "react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backButtonText?: string;
}

export function AdminLayout({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  backButtonText = "Voltar",
}: AdminLayoutProps) {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-6 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {showBackButton && onBackClick && (
                <button
                  onClick={onBackClick}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 self-start"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{backButtonText}</span>
                </button>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {title}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </a>

              <button
                onClick={signOut}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-[8%] py-8">{children}</div>
    </div>
  );
}
