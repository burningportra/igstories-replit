# Stories Component Integration Guide

## Step 1: Copy Required Files
Create these directories and files in your Next.js project:

```
components/
  ├── stories/
  │   ├── CubeStories.tsx
  │   ├── PhoneFrame.tsx
  │   └── StoryIndicator.tsx
  └── hooks/
      └── use-story-navigation.ts
```

## Step 2: Add Required CSS
Add these styles to your global CSS file:

```css
@layer components {
  .perspective-1200 {
    perspective: 1200px;
  }

  .transform-style-3d {
    transform-style: preserve-3d;
    transform-origin: center;
  }

  .backface-hidden {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
}
```

## Step 3: Component Files

### stories/CubeStories.tsx:
```tsx
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

// Rest of the CubeStories component code...
```

### stories/PhoneFrame.tsx:
```tsx
'use client';

import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="phone-frame-wrapper w-full max-w-[375px] aspect-[9/16] relative">
      <div className="phone-frame w-full h-full bg-black rounded-[3rem] shadow-2xl overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
```

### stories/StoryIndicator.tsx:
```tsx
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
```

### hooks/use-story-navigation.ts:
```tsx
'use client';

import { useState, useCallback, useEffect } from "react";

interface TouchState {
  startX: number;
  currentX: number;
  startTime?: number;
  velocity: number;
}

// Export the useStoryNavigation hook...
```

## Step 4: Usage Example
```tsx
'use client';

import CubeStories from '@/components/stories/CubeStories';

const stories = [
  {
    id: 1,
    content: (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        <h1>Your Story Content</h1>
      </div>
    )
  },
  // Add more stories...
];

export default function YourPage() {
  return (
    <div className="min-h-screen bg-[#FFEB3B] flex items-center justify-center p-4">
      <CubeStories stories={stories} />
    </div>
  );
}
```

## Required Dependencies
- `react` and `react-dom` (Next.js includes these)
- `tailwindcss` (for styling)

## Notes
- The component uses Tailwind CSS for styling
- Stories transition using 3D cube rotation
- Touch and mouse events are handled automatically
- Keyboard navigation (left/right arrows) is supported
- The component is responsive and works on both mobile and desktop
- All components are marked with 'use client' for Next.js compatibility