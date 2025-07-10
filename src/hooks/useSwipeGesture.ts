import { useEffect, useRef, useState } from "react";

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export function useSwipeGesture(options: SwipeGestureOptions) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
  } = options;

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null,
  );
  const elementRef = useRef<HTMLElement>(null);

  const minSwipeDistance = threshold;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;

    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    // Determina se o movimento é mais horizontal ou vertical
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Movimento horizontal
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      }
      if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }
    } else {
      // Movimento vertical
      if (isUpSwipe && onSwipeUp) {
        onSwipeUp();
      }
      if (isDownSwipe && onSwipeDown) {
        onSwipeDown();
      }
    }
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener("touchstart", onTouchStart);
    element.addEventListener("touchmove", onTouchMove);
    element.addEventListener("touchend", onTouchEnd);

    return () => {
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
    };
  }, [touchStart, touchEnd]);

  return elementRef;
}

// Hook específico para navegação entre páginas
export function useNavigationSwipe() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const pages = [
    { path: "/", name: "Início" },
    { path: "/sobre", name: "Sobre" },
    { path: "/portfolio", name: "Portfólio" },
    { path: "/propostas", name: "Propostas" },
    { path: "/agendamento", name: "Agendamento" },
  ];

  const navigateToNext = () => {
    if (currentIndex < pages.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return pages[currentIndex + 1];
    }
    return null;
  };

  const navigateToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return pages[currentIndex - 1];
    }
    return null;
  };

  const setCurrentPage = (path: string) => {
    const index = pages.findIndex((page) => page.path === path);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  };

  return {
    currentIndex,
    pages,
    navigateToNext,
    navigateToPrevious,
    setCurrentPage,
    currentPage: pages[currentIndex],
  };
}
