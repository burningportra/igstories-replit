import { useState, useCallback, useEffect } from "react";

interface TouchState {
  startX: number;
  currentX: number;
}

const ROTATION_MULTIPLIER = -90; // Negative for correct rotation direction

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

  const updateRotation = useCallback((index: number) => {
    setRotation(index * ROTATION_MULTIPLIER);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = normalizeIndex(prev + 1);
      updateRotation(nextIndex);
      return nextIndex;
    });
  }, [normalizeIndex, updateRotation]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = normalizeIndex(prev - 1);
      updateRotation(nextIndex);
      return nextIndex;
    });
  }, [normalizeIndex, updateRotation]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (isDragging) return;

      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

      setIsDragging(true);
      setTouchState({
        startX: clientX,
        currentX: clientX,
      });
    },
    [isDragging]
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
      const rotationDelta = (deltaX / window.innerWidth) * 45; // Reduced sensitivity
      setRotation((prev) => {
        const baseRotation = currentIndex * ROTATION_MULTIPLIER;
        return baseRotation + rotationDelta;
      });
    },
    [isDragging, touchState.startX, currentIndex]
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
      updateRotation(currentIndex);
    }

    setIsDragging(false);
  }, [isDragging, touchState, goToNext, goToPrevious, currentIndex, updateRotation]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    },
    [goToNext, goToPrevious]
  );

  useEffect(() => {
    const cleanup = () => {
      setIsDragging(false);
      updateRotation(currentIndex);
    };

    window.addEventListener("blur", cleanup);
    return () => {
      window.removeEventListener("blur", cleanup);
    };
  }, [currentIndex, updateRotation]);

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