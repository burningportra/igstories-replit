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