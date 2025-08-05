
'use client';

import React from 'react';
import WeatherResults from './WeatherResults';
import ClothResults from './ClothResults';
import { ClothApiResponse, WeatherApiResponse } from '@/app/plan/types';
import Link from 'next/link';

interface ResultsDisplayProps {
  isLoading: boolean;
  error: string | null;
  clothData: ClothApiResponse | null;
  weatherData: WeatherApiResponse | null;
  locationName: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  isLoading,
  error,
  clothData,
  weatherData,
  locationName,
}) => {
  if (isLoading) {
    return <div className="text-center text-gray-500">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  if (!clothData && !weatherData) {
    return (
      <div className="text-center text-gray-500">
        여행 정보를 입력하고 확인 버튼을 눌러주세요.
      </div>
    );
  }

  const travelDate = (weatherData && weatherData.length > 0 && weatherData[0].date)
    ? weatherData[0].date
    : ''; // 날짜가 없을 경우 빈 문자열로 설정 (null 대신)

  return (
    <div className="w-full h-full overflow-y-auto">
      <WeatherResults weatherData={weatherData} locationName={locationName} />
      <ClothResults clothData={clothData} />
      {(clothData || weatherData) && (
        <div className="mt-6 pb-4">
        {/* 옵션 1: 모바일 최적화 카드 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-4 border border-blue-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-800">다른 여행자들의 후기</h3>
              <p className="text-xs text-gray-600 mt-1">생생한 여행 경험을 확인해보세요</p>
            </div>
          </div>
          <Link
            href={{
              pathname: "/comments",
              query: {
                location: locationName,
                ...(travelDate ? { date: travelDate } : {}),
              },
            }}
            className="w-full bg-blue-600 active:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md active:shadow-lg"
          >
            <span>관련 Log 보러가기</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 옵션 2: 모바일 플로팅 버튼 스타일 */}
        {/* <div className="text-center">
          <Link
            href={{
              pathname: "/comments",
              query: {
                location: locationName,
                ...(travelDate ? { date: travelDate } : {}),
              },
            }}
            className="inline-flex items-center space-x-3 bg-white border-2 border-blue-300 text-blue-700 px-6 py-4 rounded-full font-medium active:bg-blue-50 active:border-blue-400 transition-all duration-200 shadow-lg active:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>여행 Log 구경하기</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div> */}

        {/* 옵션 3: 모바일 미니멀 스타일 */}
        {/* <div className="border-t border-gray-200 pt-4">
          <Link
            href={{
              pathname: "/comments",
              query: {
                location: locationName,
                ...(travelDate ? { date: travelDate } : {}),
              },
            }}
            className="w-full flex items-center justify-center space-x-2 text-blue-600 active:text-blue-800 font-medium py-3 rounded-lg active:bg-blue-50 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>관련 Log 보러가기</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div> */}
      </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
