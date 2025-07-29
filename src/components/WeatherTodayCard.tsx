"use client";

import { WeatherInfo } from "@/types/weather";
import { weatherThemeMap } from "@/utils/weatherThemeMap";
import WeatherCharacter from "./WeatherCharacter";

export default function WeatherTodayCard({
  weather,
}: {
  weather: WeatherInfo;
}) {
  const theme = weatherThemeMap[weather.weather] ?? weatherThemeMap.DEFAULT;

  return (
    <div className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] px-6 pt-6 pb-12">
      <div className="flex justify-between items-center gap-6">
        {/* 왼쪽 날씨 정보 */}
        <div className="flex flex-col gap-1">
          <p className="text-lg font-medium">{weather.location}</p>
          <p className="text-sm text-white/80">{weather.date}</p>
          <h1 className="text-7xl font-bold mt-1">
            {Math.round(weather.feelsLikeTemperature)}°
          </h1>
          <p className="text-base mt-2">{weather.description}</p>
          <p className="text-sm">
            최고 {weather.maxTemperature}° / 최저 {weather.minTemperature}°
          </p>
          <p className="text-sm">체감온도 {weather.feelsLikeTemperature}°</p>
        </div>

        {/* 오른쪽 캐릭터 이미지 */}
        <div className="w-32 h-32 flex-shrink-0 flex items-end justify-center mt-2">
          <WeatherCharacter src={theme.characterImage} />
        </div>
      </div>
    </div>
  );
}
