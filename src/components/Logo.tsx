import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "hero";
  variant?: "dark" | "light" | "watermark";
  className?: string;
  as?: "link" | "image" | "watermark";
  href?: string;
}

export function Logo({
  size = "md",
  variant = "dark",
  className = "",
  as = "image",
  href = "/",
}: LogoProps) {
  const sizeClasses = {
    xs: "h-6 w-auto",
    sm: "h-8 w-auto",
    md: "h-12 w-auto",
    lg: "h-16 w-auto",
    xl: "h-24 w-auto",
    hero: "h-32 sm:h-40 md:h-48 lg:h-56 w-auto",
  };

  const logoSrc =
    variant === "light" ? "/logo/LG_BRANCO.png" : "/logo/LG_PRETO.png";

  const imgClasses = `${sizeClasses[size]} ${className} ${
    variant === "watermark" ? "opacity-30" : ""
  }`;

  const imgElement = (
    <img
      src={logoSrc}
      alt="Grace Fotografia"
      className={imgClasses}
      style={
        variant === "watermark"
          ? {
              filter: "grayscale(100%)",
              mixBlendMode: "multiply",
            }
          : {}
      }
    />
  );

  if (as === "link") {
    return (
      <Link to={href} className="inline-block">
        {imgElement}
      </Link>
    );
  }

  if (as === "watermark") {
    return (
      <div
        className={`absolute bottom-4 right-4 z-10 pointer-events-none ${className}`}
      >
        <img
          src={logoSrc}
          alt=""
          className="h-8 w-auto opacity-20 grayscale"
          style={{ mixBlendMode: "multiply" }}
        />
      </div>
    );
  }

  return imgElement;
}

// Componente específico para marca d'água
export function LogoWatermark({
  className = "",
  position = "bottom-right",
  size = "sm",
}: {
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: "xs" | "sm" | "md";
}) {
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  const sizeClasses = {
    xs: "h-6 w-auto",
    sm: "h-8 w-auto",
    md: "h-12 w-auto",
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} z-10 pointer-events-none ${className}`}
    >
      <img
        src="/logo/LG_PRETO.png"
        alt=""
        className={`${sizeClasses[size]} opacity-20 grayscale`}
        style={{
          filter: "grayscale(100%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
