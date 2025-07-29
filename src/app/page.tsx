import React from "react";

import { dummyWeather } from "@/utils/dummyWeather";
import { weatherThemeMap } from "@/utils/weatherThemeMap";
import WeatherTodayCard from "@/components/WeatherTodayCard";

export default function HomePage() {
  const theme =
    weatherThemeMap[dummyWeather.weather] ?? weatherThemeMap.DEFAULT;

  return (
    <main
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${theme.backgroundImage})` }}
    >
      <div className="backdrop-blur-sm bg-black/10 min-h-screen px-4 py-6 max-w-md mx-auto">
        <WeatherTodayCard />
      </div>
    </main>
  );
}
