import React, { ReactNode } from "react";

interface BackgroundLayoutProps {
  backgroundImage?: string; // 배경 이미지 경로
  backgroundColor?: string; // 배경색
  children: ReactNode;
}

export default function BackgroundLayout({
  backgroundImage,
  backgroundColor = "#97d2e8",
  children,
}: BackgroundLayoutProps) {
  return (
    <div
      className="relative w-[390px] h-[844px]"
      style={{
        backgroundColor,
      }}
    >
      {backgroundImage && (
        <img
          className="absolute top-0 left-0 w-[390px] h-[844px] object-cover"
          src={backgroundImage}
          alt="Background"
        />
      )}
      {children}
    </div>
  );
}
