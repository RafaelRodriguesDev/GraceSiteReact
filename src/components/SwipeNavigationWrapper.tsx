import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSwipeGesture, useNavigationSwipe } from "../hooks/useSwipeGesture";

interface SwipeNavigationWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function SwipeNavigationWrapper({
  children,
  className = "",
}: SwipeNavigationWrapperProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentPage, navigateToNext, navigateToPrevious } =
    useNavigationSwipe();

  // Atualiza a página atual quando a rota muda
  React.useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname, setCurrentPage]);

  const handleSwipeLeft = () => {
    const nextPage = navigateToNext();
    if (nextPage) {
      navigate(nextPage.path);
    }
  };

  const handleSwipeRight = () => {
    const prevPage = navigateToPrevious();
    if (prevPage) {
      navigate(prevPage.path);
    }
  };

  const swipeRef = useSwipeGesture({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 75, // Aumenta o threshold para evitar navegação acidental
  });

  return (
    <div
      ref={swipeRef as React.RefObject<HTMLDivElement>}
      className={`w-full h-full ${className}`}
      style={{ touchAction: "pan-y" }} // Permite scroll vertical mas captura swipe horizontal
    >
      {children}
    </div>
  );
}
