'use client';

import { useEffect, useRef, useState } from "react";
import useStoryNavigation from "@/hooks/use-story-navigation";
import PhoneFrame from "./PhoneFrame";
import StoryIndicator from "./StoryIndicator";

interface Story {
  id: number;
  content: React.ReactNode;
}

interface CubeStoriesProps {
  stories: Story[];
}

const CUBE_WIDTH = 375; // Width of the cube face
const CUBE_TRANSLATE_Z = CUBE_WIDTH / 2;

export default function CubeStories({ stories }: CubeStoriesProps) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hintRotation, setHintRotation] = useState(0);

  const {
    currentIndex,
    rotation,
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleKeyDown,
    goToNext,
    goToPrevious,
  } = useStoryNavigation(stories.length);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.focus();
  }, []);

  useEffect(() => {
    if (!hasInteracted) {
      const animateHint = async () => {
        setHintRotation(-17);
        setTimeout(() => {
          setHintRotation(0);
        }, 800);
      };

      const intervalId = setInterval(animateHint, 3000);
      return () => clearInterval(intervalId);
    }
  }, [hasInteracted]);

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setHintRotation(0);
    }
  };

  const getSlideOpacity = (index: number) => {
    // Current slide is fully visible
    if (index === currentIndex) return 1;
    // Next slide is at 50% opacity
    if (index === currentIndex + 1) return 0.5;
    // Previous slide is at 50% opacity (except on first slide)
    if (index === currentIndex - 1 && currentIndex > 0) return 0.5;
    // All other slides are hidden
    return 0;
  };

  const currentRotation = isDragging ? rotation : rotation + hintRotation;

  return (
    <PhoneFrame>
      <div
        ref={containerRef}
        className="w-full h-full relative focus:outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={handleInteraction}
      >
        <div
          className="w-full h-full relative overflow-hidden perspective-1200"
          onTouchStart={(e) => {
            handleInteraction();
            handleTouchStart(e);
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={(e) => {
            handleInteraction();
            handleTouchStart(e);
          }}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          <div
            className="cube-wrapper absolute w-full h-full transform-style-3d"
            style={{
              transform: `translateZ(-${CUBE_TRANSLATE_Z}px) rotateY(${currentRotation}deg)`,
              transition: isDragging ? undefined : "transform 300ms cubic-bezier(0.2, 0.0, 0.2, 1)",
            }}
          >
            {stories.map((story, index) => (
              <div
                key={story.id}
                className="cube-face absolute w-full h-full backface-hidden"
                style={{
                  transform: `rotateY(${index * 90}deg) translateZ(${CUBE_TRANSLATE_Z}px)`,
                  opacity: getSlideOpacity(index),
                  transition: isDragging ? undefined : "opacity 300ms ease-out",
                  willChange: "transform, opacity",
                }}
              >
                <div className="w-full h-full">
                  {story.content}
                </div>
              </div>
            ))}
          </div>

          <button
            className={`absolute left-0 top-0 w-1/3 h-full z-10 opacity-0 ${
              currentIndex === 0 ? "hidden" : ""
            }`}
            onClick={(e) => {
              handleInteraction();
              goToPrevious();
            }}
            aria-label="Previous story"
          />
          <button
            className="absolute right-0 top-0 w-1/3 h-full z-10 opacity-0"
            onClick={(e) => {
              handleInteraction();
              goToNext();
            }}
            aria-label="Next story"
          />
        </div>

        <StoryIndicator
          currentIndex={currentIndex}
          totalStories={stories.length}
        />
      </div>
    </PhoneFrame>
  );
}