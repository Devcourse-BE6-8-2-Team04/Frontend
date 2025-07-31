"use client";

import { ReactNode } from "react";

interface WeatherInfoCardProps {
  icon: ReactNode;
  title: string;
  value?: ReactNode;
  description?: ReactNode;
}

export default function WeatherInfoCard({
  icon,
  title,
  value,
  description,
}: WeatherInfoCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white shadow-inner w-full">
      <div className="flex items-center gap-2 mb-2 text-white/90 text-sm font-semibold">
        {icon}
        {title}
      </div>

      {value && (
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
      )}

      {description && <div className="text-sm text-white">{description}</div>}
    </div>
  );
}
