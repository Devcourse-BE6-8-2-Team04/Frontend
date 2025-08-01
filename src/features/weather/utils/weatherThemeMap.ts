// utils/weatherThemeMap.ts

/**
 * 날씨 상태에 따른 테마 매핑
 * API 스키마의 WeatherInfo.weather enum 값들과 매핑
 */
export const weatherThemeMap: Record<
  string,
  {
    backgroundGradient?: string; 
    backgroundImage?: string; 
    characterImage?: string;
  }
> = {
  // 맑은 날씨
  CLEAR_SKY: {
    backgroundImage: '/images/bg-clear.png',
    characterImage: '/images/clear-character.png',
  },
  
  // 구름 날씨
  FEW_CLOUDS: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  SCATTERED_CLOUDS: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  BROKEN_CLOUDS: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  OVERCAST_CLOUDS: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  
  // 비 날씨
  LIGHT_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  MODERATE_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  HEAVY_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  VERY_HEAVY_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  EXTREME_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  FREEZING_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  LIGHT_SHOWER_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  SHOWER_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  HEAVY_SHOWER_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  RAGGED_SHOWER_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  
  // 눈 날씨
  LIGHT_SNOW: {
    backgroundImage: '/images/bg-snow.jpg',
    characterImage: '/images/snow-character.png',
  },
  SNOW: {
    backgroundImage: '/images/bg-snow.jpg',
    characterImage: '/images/snow-character.png',
  },
  HEAVY_SNOW: {
    backgroundImage: '/images/bg-snow.jpg',
    characterImage: '/images/snow-character.png',
  },
  SLEET: {
    backgroundImage: '/images/bg-snow.jpg',
    characterImage: '/images/snow-character.png',
  },
  LIGHT_SHOWER_SLEET: {
    backgroundImage: '/images/bg-snow.jpg',
    characterImage: '/images/snow-character.png',
  },
  SHOWER_SLEET: {
    backgroundImage: '/images/bg-snow.jpg',
    characterImage: '/images/snow-character.png',
  },
  LIGHT_RAIN_AND_SNOW: {
    backgroundImage: '/images/bg-snow.jpg',
    characterImage: '/images/snow-character.png',
  },
  RAIN_AND_SNOW: {
    backgroundImage: '/images/bg-snow.jpg',
    characterImage: '/images/snow-character.png',
  },
  LIGHT_SHOWER_SNOW: {
    backgroundImage: '/images/bg-snow.jpg',
    characterImage: '/images/snow-character.png',
  },
  SHOWER_SNOW: {
    backgroundImage: '/images/bg-snow.jpg',
    characterImage: '/images/snow-character.png',
  },
  HEAVY_SHOWER_SNOW: {
    backgroundImage: '/images/bg-snow.jpg',
    characterImage: '/images/snow-character.png',
  },
  
  // 안개/흐림 날씨
  MIST: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  SMOKE: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  HAZE: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  SAND_DUST_WHIRLS: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  FOG: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  SAND: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  DUST: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  VOLCANIC_ASH: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  SQUALLS: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  TORNADO: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  
  // 뇌우 날씨
  THUNDERSTORM_LIGHT_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  THUNDERSTORM_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  THUNDERSTORM_HEAVY_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  LIGHT_THUNDERSTORM: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  THUNDERSTORM: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  HEAVY_THUNDERSTORM: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  RAGGED_THUNDERSTORM: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  THUNDERSTORM_LIGHT_DRIZZLE: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  THUNDERSTORM_DRIZZLE: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  THUNDERSTORM_HEAVY_DRIZZLE: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  
  // 이슬비 날씨
  LIGHT_DRIZZLE: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  DRIZZLE: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  HEAVY_DRIZZLE: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  LIGHT_DRIZZLE_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  DRIZZLE_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  HEAVY_DRIZZLE_RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  SHOWER_RAIN_AND_DRIZZLE: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  HEAVY_SHOWER_RAIN_AND_DRIZZLE: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  SHOWER_DRIZZLE: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  
  // 폭염 날씨
  HEAT_WAVE: {
    backgroundImage: '/images/bg-clear.png',
    characterImage: '/images/clear-character.png',
  },
  
  // 기본값
  DEFAULT: {
    backgroundImage: '/images/bg-default.jpg',
    characterImage: '/images/clear-character.png',
  },
};
