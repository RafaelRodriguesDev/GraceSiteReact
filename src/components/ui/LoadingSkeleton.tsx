import React from "react";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function LoadingSkeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  lines = 1,
}: LoadingSkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200";

  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height)
    style.height = typeof height === "number" ? `${height}px` : height;

  if (variant === "text" && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${
              index === lines - 1 ? "w-3/4" : "w-full"
            }`}
            style={index === lines - 1 ? { ...style, width: "75%" } : style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Componentes pré-configurados para casos comuns
export function PhotoCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <LoadingSkeleton variant="rectangular" className="aspect-square" />
      <div className="p-3 space-y-2">
        <LoadingSkeleton variant="text" width="80%" />
        <LoadingSkeleton variant="text" width="60%" />
      </div>
    </div>
  );
}

export function AlbumCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <LoadingSkeleton variant="rectangular" className="aspect-[4/3]" />
      <div className="p-6 space-y-3">
        <LoadingSkeleton variant="text" height="24px" width="70%" />
        <LoadingSkeleton variant="text" lines={2} />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <LoadingSkeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton variant="text" width="60%" />
        <LoadingSkeleton variant="text" width="40%" />
      </div>
    </div>
  );
}
