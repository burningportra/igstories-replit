import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="phone-frame-wrapper w-full max-w-[375px] aspect-[9/16] relative">
      <div className="phone-frame w-full h-full bg-white rounded-[3rem] shadow-2xl overflow-hidden relative">
        <div className="notch absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-7 bg-black rounded-b-3xl z-20" />
        {children}
      </div>
    </div>
  );
}
