import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  as = "button",
  href,
  target,
  rel,
  ...props
}: ButtonProps) {
  const baseClasses = [
    "inline-flex items-center justify-center font-semibold rounded-full",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "tap-target", // Custom class for mobile tap targets
  ];

  const variants = {
    primary: [
      "bg-gray-900 text-white",
      "hover:bg-gray-800",
      "active:bg-gray-700",
      "shadow-lg hover:shadow-xl",
    ],
    secondary: [
      "bg-gray-100 text-gray-900",
      "hover:bg-gray-200",
      "active:bg-gray-300",
    ],
    outline: [
      "border-2 border-gray-900 text-gray-900 bg-transparent",
      "hover:bg-gray-900 hover:text-white",
      "active:bg-gray-800",
    ],
    ghost: [
      "bg-transparent text-gray-700",
      "hover:bg-gray-100",
      "active:bg-gray-200",
    ],
  };

  const sizes = {
    sm: "px-4 py-2 text-sm gap-2",
    md: "px-6 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg gap-3",
  };

  const classes = [
    ...baseClasses,
    ...variants[variant],
    sizes[size],
    className,
  ].join(" ");

  const isDisabled = disabled || loading;

  const content = loading ? (
    <>
      <LoadingSpinner
        size={size === "lg" ? "md" : "sm"}
        color={variant === "primary" ? "white" : "primary"}
      />
      <span>Carregando...</span>
    </>
  ) : (
    <>
      {leftIcon && <span>{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span>{rightIcon}</span>}
    </>
  );

  if (as === "a") {
    return (
      <a
        className={classes}
        href={href}
        target={target}
        rel={rel}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes}
      disabled={isDisabled}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}

// Variação de link que parece um botão
interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  children,
  className = "",
  ...props
}: ButtonLinkProps) {
  const baseClasses = [
    "inline-flex items-center justify-center font-semibold rounded-full",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
    "tap-target",
  ];

  const variants = {
    primary: [
      "bg-gray-900 text-white",
      "hover:bg-gray-800",
      "active:bg-gray-700",
      "shadow-lg hover:shadow-xl",
    ],
    secondary: [
      "bg-gray-100 text-gray-900",
      "hover:bg-gray-200",
      "active:bg-gray-300",
    ],
    outline: [
      "border-2 border-gray-900 text-gray-900 bg-transparent",
      "hover:bg-gray-900 hover:text-white",
      "active:bg-gray-800",
    ],
    ghost: [
      "bg-transparent text-gray-700",
      "hover:bg-gray-100",
      "active:bg-gray-200",
    ],
  };

  const sizes = {
    sm: "px-4 py-2 text-sm gap-2",
    md: "px-6 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg gap-3",
  };

  const classes = [
    ...baseClasses,
    ...variants[variant],
    sizes[size],
    className,
  ].join(" ");

  return (
    <a className={classes} {...props}>
      {leftIcon && <span>{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span>{rightIcon}</span>}
    </a>
  );
}
