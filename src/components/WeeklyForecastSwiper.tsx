"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { dummyForecast } from "@/utils/dummyForecast";
import { weatherThemeMap } from "@/utils/weatherThemeMap";
import WeatherTodayCard from "./WeatherTodayCard";

/**
 * 주간 날씨 예보를 스와이프로 볼 수 있는 컴포넌트
 *
 * @description
 * - Swiper.js를 사용한 슬라이드 기능
 * - 각 날짜별 날씨 정보를 개별 슬라이드로 표시
 * - 날씨 테마에 따른 배경 이미지 적용
 * - 페이지네이션 도트로 현재 슬라이드 표시
 * - 전체 화면 높이 기반 레이아웃
 */
export default function WeeklyForecastSwiper() {
  return (
    <div className="relative w-screen min-h-screen overflow-y-auto">
      {/* 페이지네이션 도트 (상단 고정 위치) */}
      <div className="absolute top-10 left-0 w-full flex justify-center z-20">
        <div className="swiper-pagination" />
      </div>

      {/* Swiper 슬라이더 */}
      <Swiper
        slidesPerView={1} // 한 번에 하나의 슬라이드만 표시
        modules={[Pagination]} // 페이지네이션 모듈 사용
        pagination={{
          clickable: true, // 도트 클릭으로 슬라이드 이동 가능
          el: ".swiper-pagination", // 페이지네이션 요소 지정
        }}
        className="w-screen min-h-screen"
      >
        {/* 각 날짜별 날씨 슬라이드 */}
        {dummyForecast.map((day) => {
          // 날씨 상태에 따른 테마 정보 가져오기
          const theme = weatherThemeMap[day.weather] ?? weatherThemeMap.DEFAULT;

          return (
            <SwiperSlide key={day.id}>
              {/* 배경 이미지가 적용된 슬라이드 컨테이너 */}
              <div
                className="min-h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${theme.backgroundImage})` }}
              >
                {/* 날씨 정보 카드 컨테이너 */}
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
