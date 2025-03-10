'use client';

interface StoryIndicatorProps {
  currentIndex: number;
  totalStories: number;
}

export default function StoryIndicator({
  currentIndex,
  totalStories,
}: StoryIndicatorProps) {
  return (
    <div className="absolute bottom-4 right-4 z-20 bg-black/50 rounded-full px-2 py-1 text-white text-sm">
      {currentIndex + 1}/{totalStories}
    </div>
  );
}