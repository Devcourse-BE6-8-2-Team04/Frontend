import React from "react";
import { MapPin, Thermometer, Calendar } from "lucide-react";
import type { components } from "@/lib/backend/apiV1/schema";

type WeatherInfoDto = components["schemas"]["CommentDto"]["weatherInfoDto"];

interface WeatherInfoProps {
  weatherInfo: WeatherInfoDto;
}

export function WeatherInfo({ weatherInfo }: WeatherInfoProps) {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Thermometer size={16} />
        날씨 정보
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {weatherInfo.location && (
          <div className="flex items-center gap-2 bg-white p-3 rounded-xl">
            <MapPin size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{weatherInfo.location}</span>
          </div>
        )}
        {weatherInfo.feelsLikeTemperature !== undefined && (
          <div className="flex items-center gap-2 bg-white p-3 rounded-xl">
            <Thermometer size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-700">{weatherInfo.feelsLikeTemperature}°C</span>
          </div>
        )}
        <div className="flex items-center gap-2 bg-white p-3 rounded-xl">
          <Calendar size={16} className="text-green-500" />
          <span className="text-sm font-medium text-gray-700">
            {new Date(weatherInfo.date).toLocaleDateString("ko-KR", { month: 'long' })}
          </span>
        </div>
      </div>
    </div>
  );
}