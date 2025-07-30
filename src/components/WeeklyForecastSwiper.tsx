"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { dummyForecast } from "@/utils/dummyForecast";
import { weatherThemeMap } from "@/utils/weatherThemeMap";
import WeatherTodayCard from "./WeatherTodayCard";

export default function WeeklyForecastSwiper() {
  return (
    <div className="relative w-screen min-h-screen overflow-y-auto">
      {/* 도트 스와이프 위치 고정 */}
      <div className="absolute top-10 left-0 w-full flex justify-center z-20">
        <div className="swiper-pagination" />
      </div>

      {/* Swiper 자체도 min-height 기반으로 */}
      <Swiper
        slidesPerView={1}
        modules={[Pagination]}
        pagination={{ clickable: true, el: ".swiper-pagination" }}
        className="w-screen min-h-screen"
      >
        {dummyForecast.map((day) => {
          const theme = weatherThemeMap[day.weather] ?? weatherThemeMap.DEFAULT;

          return (
            <SwiperSlide key={day.id}>
              <div
                className="min-h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${theme.backgroundImage})` }}
              >
                <div className="min-h-screen px-4 py-6 max-w-md mx-auto pt-10 bg-black/10">
                  <WeatherTodayCard weather={day} />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
