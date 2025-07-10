import React from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline";
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {icon && (
        <div className="flex justify-center mb-6">
          <div className="text-gray-400">{icon}</div>
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      {description && (
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <Button variant={action.variant || "primary"} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Estados específicos pré-configurados
export function NoPhotosState({ onUpload }: { onUpload?: () => void }) {
  return (
    <EmptyState
      icon={
        <svg
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      }
      title="Nenhuma foto encontrada"
      description="Este álbum ainda não possui fotos. Adicione algumas para começar a galeria."
      action={
        onUpload
          ? {
              label: "Adicionar Fotos",
              onClick: onUpload,
            }
          : undefined
      }
    />
  );
}

export function NoAlbumsState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={
        <svg
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      }
      title="Em breve"
      description="Nossos álbuns de fotos estarão disponíveis em breve. Volte mais tarde para ver nosso trabalho."
      action={
        onCreate
          ? {
              label: "Criar Álbum",
              onClick: onCreate,
            }
          : undefined
      }
    />
  );
}

export function SearchEmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon={
        <svg
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title="Nenhum resultado encontrado"
      description={`Não encontramos resultados para "${query}". Tente usar termos diferentes.`}
      action={
        onClear
          ? {
              label: "Limpar Busca",
              onClick: onClear,
              variant: "outline",
            }
          : undefined
      }
    />
  );
}

export function ErrorState({
  title = "Algo deu errado",
  description = "Ocorreu um erro inesperado. Tente novamente em alguns momentos.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={
        <svg
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
      title={title}
      description={description}
      action={
        onRetry
          ? {
              label: "Tentar Novamente",
              onClick: onRetry,
              variant: "outline",
            }
          : undefined
      }
    />
  );
}
