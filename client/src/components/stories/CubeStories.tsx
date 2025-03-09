import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import useStoryNavigation from "@/hooks/use-story-navigation";
import PhoneFrame from "./PhoneFrame";
import StoryIndicator from "./StoryIndicator";

interface Story {
  id: number;
  imageUrl: string;
  alt: string;
}

interface CubeStoriesProps {
  stories: Story[];
}

export default function CubeStories({ stories }: CubeStoriesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.focus();
  }, []);

  return (
    <PhoneFrame>
      <div
        ref={containerRef}
        className="w-full h-full relative focus:outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div
          className="w-full h-full relative overflow-hidden perspective-1200"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          <motion.div
            className="cube-wrapper absolute w-full h-full transform-style-3d"
            style={{
              transform: `translateZ(-375px) rotateY(${rotation}deg)`,
              transition: isDragging ? "none" : "transform 0.5s ease",
            }}
          >
            {stories.map((story, index) => (
              <div
                key={story.id}
                className="cube-face absolute w-full h-full backface-hidden"
                style={{
                  transform: `rotateY(${index * 90}deg) translateZ(375px)`,
                }}
              >
                <img
                  src={story.imageUrl}
                  alt={story.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>

          <button
            className="absolute left-0 top-0 w-1/3 h-full z-10 opacity-0"
            onClick={goToPrevious}
            aria-label="Previous story"
          />
          <button
            className="absolute right-0 top-0 w-1/3 h-full z-10 opacity-0"
            onClick={goToNext}
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
