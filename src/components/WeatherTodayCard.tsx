"use client";

import { WeatherInfo } from "@/types/weather";
import { dummyWeather } from "@/utils/dummyWeather";
import { weatherThemeMap } from "@/utils/weatherThemeMap";

export default function WeatherTodayCard({
  weather,
}: {
  weather: WeatherInfo;
}) {
  const theme = weatherThemeMap[weather.weather] ?? weatherThemeMap.DEFAULT;

  return (
    <div className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-lg font-medium">{weather.location}</p>
          <p className="text-sm mt-1"> {weather.date} </p>
          <h1 className="text-7xl font-bold mt-1">
            {Math.round(weather.feelsLikeTemperature)}°
          </h1>
          <p className="text-base mt-2">{weather.description}</p>
          <p className="text-sm mt-1">
            최고 {weather.maxTemperature}° / 최저 {weather.minTemperature}°
          </p>
          <p className="text-sm mt-1">
            체감온도 {weather.feelsLikeTemperature}°
          </p>
        </div>

        {theme.characterImage ? (
          <img
            src={theme.characterImage}
            alt="weather character"
            className="w-24 h-24"
          />
        ) : null}
      </div>
    </div>
  );
}
