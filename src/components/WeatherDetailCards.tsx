"use client";

import { WeatherInfo } from "@/types/weather";
import WeatherInfoCard from "./WeatherInfoCard";
import { Wind, Droplet, Gauge, Umbrella } from "lucide-react";

function getWindFeeling(speed: number): string {
  if (speed < 0.3) return "바람 없음";
  if (speed < 1.6) return "실바람";
  if (speed < 3.4) return "약한 바람";
  if (speed < 5.5) return "산들바람";
  if (speed < 8.0) return "조금 강한 바람";
  if (speed < 10.8) return "강한 바람";
  return "매우 강한 바람";
}

function getWindDirectionLabel(deg?: number): string {
  if (deg === undefined) return "";
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

function getUVInfo(uvi: number) {
  if (uvi < 3) return { level: "낮음" };
  if (uvi < 6) return { level: "보통" };
  if (uvi < 8) return { level: "높음" };
  if (uvi < 11) return { level: "매우 높음" };
  return { level: "위험" };
}

function getHumidityInfo(humidity: number) {
  if (humidity < 30) return { label: "건조", color: "bg-blue-300" };
  if (humidity < 60) return { label: "쾌적", color: "bg-green-400" };
  if (humidity < 80) return { label: "약간 습함", color: "bg-yellow-400" };
  return { label: "매우 습함", color: "bg-red-400" };
}

export default function WeatherDetailCards({
  weather,
}: {
  weather: WeatherInfo;
}) {
  const { uvi, humidity, pop, rain, snow, windDeg, windSpeed } = weather;
  const uv = uvi !== undefined ? getUVInfo(uvi) : undefined;
  const hum = humidity !== undefined ? getHumidityInfo(humidity) : undefined;

  return (
    <div className="grid grid-cols-2 gap-3 px-2 mt-6">
      {/* 🌧 강수 정보 */}
      {(pop !== undefined || rain !== undefined || snow !== undefined) && (
        <div className="col-span-2">
          <WeatherInfoCard
            icon={<Umbrella size={18} />}
            title="강수 정보"
            value={
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-white">
                  {pop !== undefined ? `${Math.round(pop * 100)}%` : "-"}
                </span>
              </div>
            }
            description={
              <div className="mt-2 space-y-2">
                {pop !== undefined && (
                  <div className="w-full h-2 bg-white/20 rounded">
                    <div
                      className="h-2 bg-blue-400 rounded"
                      style={{ width: `${Math.round(pop * 100)}%` }}
                    />
                  </div>
                )}
                <div className="flex gap-4 text-sm text-white/90">
                  <div>강수량: {rain ?? 0} mm</div>
                  <div>적설량: {snow ?? 0} mm</div>
                </div>
              </div>
            }
          />
        </div>
      )}

      {/* 🌬 바람 */}
      {windSpeed !== undefined && (
        <div className="col-span-2">
          <WeatherInfoCard
            icon={<Wind size={18} />}
            title="바람"
            description={
              <div className="grid grid-cols-2 gap-2 items-center mt-2">
                {/* 왼쪽: 텍스트 */}
                <div className="text-sm space-y-1 flex flex-col">
                  <span className="text-lg font-semibold text-white">
                    {getWindFeeling(windSpeed)}
                  </span>
                  <div>풍속: {windSpeed} m/s</div>
                  <div>
                    풍향: {windDeg}° {getWindDirectionLabel(windDeg)}
                  </div>
                </div>

                {/* 오른쪽: 나침반 */}
                <div className="flex justify-center">
                  <div className="relative w-24 h-24 rounded-full border border-white flex items-center justify-center">
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 text-xs text-white/70">
                      N
                    </span>
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-white/70">
                      S
                    </span>
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs text-white/70">
                      W
                    </span>
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-white/70">
                      E
                    </span>
                    <div
                      className="absolute top-1/2 left-1/2 text-lg text-white origin-center"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${
                          (windDeg ?? 0) + 90
                        }deg)`,
                      }}
                    >
                      ➤
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      )}

      {/* 🌞 자외선 지수 */}
      {uvi !== undefined && uv && (
        <WeatherInfoCard
          icon={<Gauge size={18} />}
          title="자외선 지수"
          value={
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-white">{uvi}</span>
              <span className="text-sm text-white/70">{uv.level}</span>
            </div>
          }
          description={
            <div className="mt-2 relative">
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500" />
              <div
                className="absolute top-1/2 w-4 h-4 rounded-full border border-white bg-white"
                style={{
                  left: `${(uvi / 11) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          }
        />
      )}

      {/* 💧 습도 */}
      {humidity !== undefined && hum && (
        <WeatherInfoCard
          icon={<Droplet size={18} />}
          title="습도"
          value={
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-white">
                {humidity}%
              </span>
              <span className="text-sm text-white/70">{hum.label}</span>
            </div>
          }
          description={
            <div className="w-full h-2 rounded-full mt-2">
              <div className={`h-2 rounded ${hum.color}`} />
            </div>
          }
        />
      )}
    </div>
  );
}
