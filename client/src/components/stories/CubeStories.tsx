import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
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
  const controls = useAnimation();

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
        await controls.start({
          rotateY: -80, // Increased rotation for more next slide visibility
          transition: { duration: 0.5, ease: "easeInOut" } // Adjusted duration and easing
        });
        // Return to original position
        await controls.start({
          rotateY: 0,
          transition: { duration: 0.3, ease: "easeInOut" } // Adjusted duration and easing
        });
      };

      const intervalId = setInterval(animateHint, 2000); // Repeat every 2 seconds

      return () => clearInterval(intervalId);
    }
  }, [hasInteracted, controls]);

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      // Reset to base rotation when user interacts
      controls.start({
        rotateY: 0,
        transition: { duration: 0.3, ease: "easeOut" }
      });
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
          {/* Hint animation wrapper */}
          {!hasInteracted && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={controls}
            />
          )}
          {/* Main cube wrapper */}
          <div
            className="cube-wrapper absolute w-full h-full transform-style-3d"
            style={{
              transform: `translateZ(-${CUBE_SIZE / 2}px) rotateY(${rotation}deg)`,
              transition: isDragging ? undefined : "transform 500ms cubic-bezier(0.4, 0.0, 0.2, 1)",
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