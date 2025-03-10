'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Story {
  id: number;
  content: React.ReactNode;
}

interface CubeStoriesProps {
  stories: Story[];
}

// Constants for 3D cube dimensions
const CUBE_WIDTH = 375;
const CUBE_TRANSLATE_Z = CUBE_WIDTH / 2;
const CUBE_PERSPECTIVE = 1200;

export default function Stories() {
  // Hook states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [totalRotations, setTotalRotations] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hintRotation, setHintRotation] = useState(0);

  const cubeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = 7;

  // Navigation functions
  const updateCubeRotation = () => {
    if (cubeRef.current) {
      const rotation = (currentIndex * -90) + (totalRotations * -360);
      cubeRef.current.style.transition = 'transform 0.5s ease';
      cubeRef.current.style.transform = `translateZ(-${CUBE_TRANSLATE_Z}px) rotateY(${rotation}deg)`;
    }
  };

  const updateRotationWhileDragging = (deltaX: number) => {
    if (cubeRef.current) {
      const baseRotation = (currentIndex * -90) + (totalRotations * -360);
      const rotation = baseRotation + (deltaX / 4);
      cubeRef.current.style.transition = 'none';
      cubeRef.current.style.transform = `translateZ(-${CUBE_TRANSLATE_Z}px) rotateY(${rotation}deg)`;
    }
  };

  // Touch/Mouse event handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isAnimating) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || isAnimating) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const deltaX = clientX - startX;
    setCurrentX(deltaX);
    updateRotationWhileDragging(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isAnimating) return;
    setIsDragging(false);
    if (currentX < -50) {
      goToNext();
    } else if (currentX > 50) {
      goToPrevious();
    } else {
      updateCubeRotation();
    }
    setCurrentX(0);
  };

  const handleMouseLeave = () => {
    if (isDragging && !isAnimating) {
      setIsDragging(false);
      updateCubeRotation();
      setCurrentX(0);
    }
  };

  // Navigation functions
  const goToNext = () => {
    setIsAnimating(true);
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      const nextRotation = ((currentIndex + 1) * -90) + (totalRotations * -360);
      if (cubeRef.current) {
        cubeRef.current.style.transition = 'transform 0.5s ease';
        cubeRef.current.style.transform = `translateZ(-${CUBE_TRANSLATE_Z}px) rotateY(${nextRotation}deg)`;
        setTimeout(() => {
          setCurrentIndex(0);
          setTotalRotations(prev => prev + 1);
        }, 500);
      }
    }
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToPrevious = () => {
    setIsAnimating(true);
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    } else {
      const nextRotation = ((currentIndex - 1) * -90) + (totalRotations * -360);
      if (cubeRef.current) {
        cubeRef.current.style.transition = 'transform 0.5s ease';
        cubeRef.current.style.transform = `translateZ(-${CUBE_TRANSLATE_Z}px) rotateY(${nextRotation}deg)`;
        setTimeout(() => {
          setCurrentIndex(totalSlides - 1);
          setTotalRotations(prev => prev - 1);
        }, 500);
      }
    }
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Initial hint animation
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnimating]);

  // Update cube rotation when currentIndex changes
  useEffect(() => {
    if (cubeRef.current) {
      const rotation = (currentIndex * -90) + (totalRotations * -360);
      cubeRef.current.style.transition = 'transform 0.5s ease';
      cubeRef.current.style.transform = `translateZ(-${CUBE_TRANSLATE_Z}px) rotateY(${rotation}deg)`;
    }
  }, [currentIndex, totalRotations]);

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setHintRotation(0);
    }
  };

  const getSlideOpacity = (index: number) => {
    if (index === currentIndex) return 1;
    if (index === currentIndex + 1) return 0.5;
    if (index === currentIndex - 1 && currentIndex > 0) return 0.5;
    return 0;
  };

  const currentRotation = isDragging ? rotation : rotation + hintRotation;

  return (
    <div className="page-wrapper">
      {/* Desktop Header */}
      <div className="desktop-header">
        <Link href="/">
          <Image 
            src="/images/Hoyehh-wordmark.svg" 
            alt="HOYEHH Wordmark Logo" 
            width={180}
            height={45} 
            className="object-contain"
          />
        </Link>
      </div>

      {/* Main content */}
      <div className="slider-container">
        {/* Phone frame */}
        <div 
          className="phone-frame"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleMouseLeave}
        >
          {/* 3D Cube */}
          <div 
            ref={cubeRef}
            className="cube-wrapper"
          >
            {/* Slides */}
            {/* Slide 1 */}
            <div 
              className="absolute w-full h-full flex flex-col items-center justify-start cube-face rounded-2xl"
              style={{
                transform: `rotateY(0deg) translateZ(250px)`,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                backgroundColor: 'rgba(255, 235, 59, 1)',
              }}
            >
              {/* Story number */}
              <div className="absolute bottom-[20px] right-[20px] bg-black bg-opacity-40 px-[10px] py-[5px] rounded-[15px] text-[12px] text-white story-number">
                1/{totalSlides}
              </div>
              
              {/* Marquee section with pull quotes */}
              <div className="bg-[#EE5524] pt-4 pb-4 w-full overflow-hidden rounded-t-2xl">
                <div className="marquee-container">
                  <div className="marquee">
                    <span className="mx-8 text-white font-bold text-lg">&quot;We&apos;re obsessed&quot;</span>
                    <span className="mx-8 text-white font-bold text-lg">&quot;oh its going on stuff&quot;</span>
                    <span className="mx-8 text-white font-bold text-lg">&quot;others are just spicy...but HOYEHH is flavorful&quot;</span>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 flex flex-col items-center justify-start lg:justify-center px-8 py-4 lg:py-8 space-y-4 text-center w-full">
                {/* Logo 1 - Hoyehh Hanuman */}
                <div className="w-48 h-48 flex items-center justify-center mt-4 lg:mt-0">
                  <Image 
                    src="/images/hoyehh-hanuman.svg" 
                    alt="HOYEHH Hanuman Logo" 
                    width={192} 
                    height={192} 
                    className="object-contain"
                    style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}
                    priority
                  />
                </div>

                {/* Group for text content with responsive spacing */}
                <div className="flex flex-col space-y-3 lg:space-y-4">
                  {/* Craft Chili Oil text */}
                  <h2 className="text-2xl font-bold text-black">craft chili oil</h2>

                  {/* Logo 2 - Hoyehh Wordmark */}
                  <div className="w-[270px] flex items-center justify-center">
                    <Image 
                      src="/images/Hoyehh-wordmark.svg" 
                      alt="HOYEHH Wordmark Logo" 
                      width={270}
                      height={67} 
                      className="object-contain"
                      style={{ width: '100%', height: '67px' }}
                    />
                  </div>

                  {/* Latest Batch text */}
                  <h3 className="text-xl font-medium text-black">latest batch</h3>

                  {/* Date and stock count */}
                  <p className="text-lg text-black">
                    2/25/25 <span className="text-[#EE5524] font-bold">(4 left)</span>
                  </p>
                </div>

                {/* Buy Now button */}
                <Link
                  href="/pricing"
                  className="mt-4 px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors"
                >
                  Buy Now
                </Link>
              </div>
            </div>
            
            {/* Add additional slides here following the same structure */}
          </div>
          
          {/* Navigation buttons */}
          <button 
            className="nav-button prev-button"
            onClick={() => {
              handleInteraction();
              goToPrevious();
            }}
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <button 
            className="nav-button next-button"
            onClick={() => {
              handleInteraction();
              goToNext();
            }}
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
            
      <style jsx>{`
        .page-wrapper {
          min-height: 100vh;
          background-color: #FFEB3B;
          display: flex;
          flex-direction: column;
        }

        .desktop-header {
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
        }

        .slider-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .phone-frame {
          width: 100%;
          height: 100vh;
          position: relative;
          overflow: hidden;
          perspective: ${CUBE_PERSPECTIVE}px;
          touch-action: pan-x;
        }

        .cube-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform: translateZ(-${CUBE_TRANSLATE_Z}px) rotateY(0deg);
          transition: transform 0.5s ease;
        }

        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: black;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          outline: none;
          z-index: 20;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .nav-button:hover {
          background: #333;
          transform: translateY(-50%) scale(1.1);
        }

        .prev-button {
          left: 1rem;
        }

        .next-button {
          right: 1rem;
        }

        /* Desktop styles */
        @media (min-width: 1024px) {
          .desktop-header {
            display: flex;
          }

          .phone-frame {
            width: 375px;
            height: 667px;
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }

          .prev-button {
            left: -60px;
          }

          .next-button {
            right: -60px;
          }
        }

        /* Mobile styles */
        @media (max-width: 1023px) {
          .desktop-header {
            display: none;
          }
        }

        .marquee-container {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        
        .marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 25s linear infinite;
          padding-left: 100%;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        /* Add 3D effect styles */
        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          background-image: url('/images/texture.png');
          background-size: contain;
          background-repeat: repeat-x;
          background-position: center;
          background-blend-mode: multiply;
        }
      `}</style>
    </div>
  );
}
