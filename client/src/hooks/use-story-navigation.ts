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
      if (index < 0) return totalStories - 1;
      if (index >= totalStories) return 0;
      return index;
    },
    [totalStories]
  );

  const updateRotation = useCallback((index: number) => {
    setRotation(index * -90); // Always rotate by 90 degrees
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

      setTouchState((prev) => ({
        ...prev,
        currentX: clientX,
        velocity: velocity,
      }));

      const deltaX = clientX - touchState.startX;
      const rotationDelta = (deltaX / window.innerWidth) * 120; // Increased sensitivity for more responsive feel
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
    const threshold = window.innerWidth * 0.15; // Reduced threshold to 15% of screen width
    const velocityThreshold = 0.3; // Lower velocity threshold for more responsive flick gestures

    // Transition based on either distance or velocity
    if (Math.abs(deltaX) > threshold || Math.abs(touchState.velocity) > velocityThreshold) {
      if (deltaX > 0 || touchState.velocity > velocityThreshold) {
        goToPrevious();
      } else {
        goToNext();
      }
    } else {
      // Snap back to current if neither threshold is met
      updateRotation(currentIndex);
    }

    setIsDragging(false);
    setTouchState((prev) => ({ ...prev, velocity: 0 }));
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