'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useStoryNavigation } from '@/hooks/use-story-navigation';


interface ImageUrls {
  hanuman: string;
  wordmark: string;
  monkeyOpenMouth: string;
  hoyehhOnEggs: string;
  hoyehhOnRice: string;
  hoyehhOnPizza: string;
  hoyehhOnSandwiches: string;
  texture: string;
}

const StoryIndicator = ({ activeIndex, totalStories }: { activeIndex: number; totalStories: number }) => (
  <div className="flex justify-center mt-4">
    {Array.from({ length: totalStories }).map((_, index) => (
      <div
        key={index}
        className={clsx(
          'w-3 h-3 rounded-full mx-1 bg-gray-400',
          index === activeIndex && 'bg-gray-800'
        )}
      />
    ))}
  </div>
);


const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-[390px] h-[844px] bg-white rounded-2xl shadow-lg overflow-hidden">
    {children}
  </div>
);

const CubeStories = ({ stories }: { stories: any[] }) => {
  const { activeIndex, handlePrev, handleNext } = useStoryNavigation(stories.length);

  return (
    <div className="relative perspective-1200">
      <div className="transform-style-3d relative w-full h-full">
        {stories.map((story, index) => (
          <div
            key={index}
            className={clsx(
              'absolute w-full h-full transform-style-3d backface-hidden transition-transform duration-500 ease-in-out',
              index === activeIndex ? 'translate-x-0' : index < activeIndex ? '-translate-x-full' : 'translate-x-full'
            )}
          >
            <PhoneFrame>{story.content}</PhoneFrame>
          </div>
        ))}
      </div>
      <StoryIndicator activeIndex={activeIndex} totalStories={stories.length} />
    </div>
  );
};


const useStoryNavigation = (totalStories: number) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? totalStories -1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === totalStories - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  return { activeIndex, handlePrev, handleNext };
};


export default function Stories() {
  const [imageUrls, setImageUrls] = useState<ImageUrls>({
    hanuman: '/images/hoyehh-hanuman.svg',
    wordmark: '/images/Hoyehh-wordmark.svg',
    monkeyOpenMouth: '/images/Hoyehh-monkey-open-mouth.svg',
    hoyehhOnEggs: '/images/hoyehh-on-eggs.png',
    hoyehhOnRice: '/images/hoyehh-on-rice.png',
    hoyehhOnPizza: '/images/hoyehh-on-pizza.png',
    hoyehhOnSandwiches: '/images/hoyehh-on-sandwiches.png',
    texture: '/images/texture.png',
  });

  const stories = [
    {
      id: 1,
      content: ({imageUrls}: {imageUrls: ImageUrls}) => (
        <div className="h-full flex flex-col">
          <div className="bg-[#EE5524] pt-4 pb-4 w-full overflow-hidden rounded-t-2xl">
            <div className="marquee-container">
              <div className="marquee">
                <span className="mx-8 text-white font-bold text-lg">&quot;We&apos;re obsessed&quot;</span>
                <span className="mx-8 text-white font-bold text-lg">&quot;oh its going on stuff&quot;</span>
                <span className="mx-8 text-white font-bold text-lg">&quot;others are just spicy...but HOYEHH is flavorful&quot;</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-start lg:justify-center px-8 py-4 lg:py-8 space-y-4 text-center w-full">
            <div className="w-48 h-48 flex items-center justify-center mt-4 lg:mt-0">
              <Image
                src={imageUrls.hanuman}
                alt="HOYEHH Hanuman Logo"
                width={192}
                height={192}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col space-y-3 lg:space-y-4">
              <h2 className="text-2xl font-bold text-black">craft chili oil</h2>
              <div className="w-[270px] flex items-center justify-center">
                <Image
                  src={imageUrls.wordmark}
                  alt="HOYEHH Wordmark Logo"
                  width={270}
                  height={67}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-medium text-black">latest batch</h3>
              <p className="text-lg text-black">
                2/25/25 <span className="text-[#EE5524] font-bold">(4 left)</span>
              </p>
            </div>
            <button className="mt-4 px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors">
              Buy Now
            </button>
          </div>
        </div>
      ),
    },
    // ... other stories (add more stories here following the same structure)
  ];

  const renderedStories = stories.map((story) => ({
    ...story,
    content: typeof story.content === 'function' ? story.content({ imageUrls }) : story.content,
  }));

  return (
    <div className="min-h-screen bg-[#FFEB3B] flex items-center justify-center p-4">
      <CubeStories stories={renderedStories} />
    </div>
  );
}