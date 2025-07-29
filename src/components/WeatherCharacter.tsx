"use client";

interface WeatherCharacterProps {
  src?: string;
  alt?: string;
}

export default function WeatherCharacter({
  src,
  alt = "weather character",
}: WeatherCharacterProps) {
  if (!src) return null;

  return <img src={src} alt={alt} className="w-24 object-contain" />;
}
