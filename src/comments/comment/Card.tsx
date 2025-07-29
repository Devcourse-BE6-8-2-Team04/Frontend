import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  opacity?: number; // 0~100
}

export default function Card({
  children,
  className = "",
  opacity = 100,
}: CardProps) {
  const cardOpacity = `bg-white/[${
    Math.min(Math.max(opacity, 0), 100)
  }]`; // 0~100만 허용

  return (
    <div
      className={clsx(
        "rounded-xl shadow-md transition-all",
        cardOpacity,
        className
      )}
    >
      {children}
    </div>
  );
}
