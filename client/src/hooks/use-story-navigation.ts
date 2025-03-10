import { useState, useCallback, useEffect } from "react";

interface TouchState {
  startX: number;
  currentX: number;
  startTime?: number;
  velocity: number;
}

export default function useStoryNavigation(totalStories: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    currentX: 0,
    velocity: 0,
  });

  const normalizeIndex = useCallback(
    (index: number) => {
      if (index < 0) return 0; // Prevent going below 0
      if (index >= totalStories) return 0;
      return index;
    },
    [totalStories]
  );

  const updateRotation = useCallback((index: number) => {
    setRotation(index * -90);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = normalizeIndex(prev + 1);
      updateRotation(nextIndex);
      return nextIndex;
    });
  }, [normalizeIndex, updateRotation]);

  const goToPrevious = useCallback(() => {
    if (currentIndex === 0) return; // Prevent going back on first slide
    setCurrentIndex((prev) => {
      const nextIndex = normalizeIndex(prev - 1);
      updateRotation(nextIndex);
      return nextIndex;
    });
  }, [currentIndex, normalizeIndex, updateRotation]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (isDragging) return;

      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

      setIsDragging(true);
      setTouchState({
        startX: clientX,
        currentX: clientX,
        startTime: Date.now(),
        velocity: 0,
      });
    },
    [isDragging]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging) return;

      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const deltaTime = Date.now() - (touchState.startTime || Date.now());
      const velocity = deltaTime > 0 ? (clientX - touchState.currentX) / deltaTime : 0;
      const deltaX = clientX - touchState.startX;

      // Prevent backward swipe on first slide
      if (currentIndex === 0 && deltaX > 0) {
        return;
      }

      setTouchState((prev) => ({
        ...prev,
        currentX: clientX,
        velocity: velocity,
      }));

      const rotationDelta = (deltaX / window.innerWidth) * 120;
      setRotation((prev) => {
        const baseRotation = currentIndex * -90;
        return baseRotation + rotationDelta;
      });
    },
    [isDragging, touchState.startX, touchState.currentX, touchState.startTime, currentIndex]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    const deltaX = touchState.currentX - touchState.startX;
    const threshold = window.innerWidth * 0.15;
    const velocityThreshold = 0.3;

    // Only allow forward navigation on first slide
    if (currentIndex === 0 && deltaX > 0) {
      updateRotation(currentIndex);
    } else if (Math.abs(deltaX) > threshold || Math.abs(touchState.velocity) > velocityThreshold) {
      if (deltaX > 0 || touchState.velocity > velocityThreshold) {
        goToPrevious();
      } else {
        goToNext();
      }
    } else {
      updateRotation(currentIndex);
    }

    setIsDragging(false);
    setTouchState((prev) => ({ ...prev, velocity: 0 }));
  }, [isDragging, touchState, goToNext, goToPrevious, currentIndex, updateRotation]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          if (currentIndex !== 0) goToPrevious(); // Only allow if not on first slide
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    },
    [goToNext, goToPrevious, currentIndex]
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