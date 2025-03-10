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

const CUBE_SIZE = 375; // Width of the cube face

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

  // Initial hint animation
  useEffect(() => {
    if (!hasInteracted) {
      const animateHint = async () => {
        // Move towards next slide
        setHintRotation(-17); // Reduced to show less of the next slide
        // Return to original position after a delay
        setTimeout(() => {
          setHintRotation(0);
        }, 800);
      };

      const intervalId = setInterval(animateHint, 3000); // Repeat every 3 seconds

      return () => clearInterval(intervalId);
    }
  }, [hasInteracted]);

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setHintRotation(0);
    }
  };

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
              transform: `translateZ(-${CUBE_SIZE / 2}px) rotateY(${isDragging ? rotation : rotation + hintRotation}deg)`,
              transition: isDragging ? undefined : "transform 800ms cubic-bezier(0.4, 0.0, 0.2, 1)",
            }}
          >
            {stories.map((story, index) => (
              <div
                key={story.id}
                className="cube-face absolute w-full h-full backface-hidden bg-white"
                style={{
                  transform: `rotateY(${index * 90}deg) translateZ(${CUBE_SIZE / 2}px)`,
                }}
              >
                <div className="w-full h-full">
                  {story.content}
                </div>
              </div>
            ))}
          </div>

          <button
            className="absolute left-0 top-0 w-1/3 h-full z-10 opacity-0"
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