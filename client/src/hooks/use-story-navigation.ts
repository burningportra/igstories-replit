import { useState, useCallback, useEffect } from "react";

interface TouchState {
  startX: number;
  currentX: number;
}

export default function useStoryNavigation(totalStories: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    currentX: 0,
  });

  const normalizeIndex = useCallback(
    (index: number) => {
      if (index < 0) return totalStories - 1;
      if (index >= totalStories) return 0;
      return index;
    },
    [totalStories]
  );

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => normalizeIndex(prev + 1));
    setRotation((prev) => prev - 90);
  }, [normalizeIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => normalizeIndex(prev - 1));
    setRotation((prev) => prev + 90);
  }, [normalizeIndex]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

      setIsDragging(true);
      setTouchState({
        startX: clientX,
        currentX: clientX,
      });
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging) return;

      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

      setTouchState((prev) => ({
        ...prev,
        currentX: clientX,
      }));

      const deltaX = clientX - touchState.startX;
      const rotationDelta = (deltaX / window.innerWidth) * 90;
      setRotation((prev) => prev + rotationDelta);
    },
    [isDragging, touchState.startX]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    const deltaX = touchState.currentX - touchState.startX;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    } else {
      setRotation((prev) => Math.round(prev / 90) * 90);
    }

    setIsDragging(false);
  }, [isDragging, touchState, goToNext, goToPrevious]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    },
    [goToNext, goToPrevious]
  );

  useEffect(() => {
    const cleanup = () => {
      setIsDragging(false);
    };

    window.addEventListener("blur", cleanup);
    return () => {
      window.removeEventListener("blur", cleanup);
    };
  }, []);

  return {
    currentIndex,
    rotation,
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleKeyDown,
    goToNext,
    goToPrevious,
  };
}
