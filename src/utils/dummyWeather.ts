import type { WeatherInfo } from '@/types/weather';

export const dummyWeather: WeatherInfo = {
  id: 1,
  weather: 'CLEAR',
  description: '맑음',
  dailyTemperatureGap: 9,
  feelsLikeTemperature: 36,
  maxTemperature: 35,
  minTemperature: 26,
  pop: 0,
  rain: 0,
  snow: 0,
  humidity: 40,
  windSpeed: 2.8,
  windDeg: 90,
  uvi: 7.5,
  location: '서울',
  date: '2025-07-29',
};