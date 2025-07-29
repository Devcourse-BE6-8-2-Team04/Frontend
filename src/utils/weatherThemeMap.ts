// utils/weatherThemeMap.ts

export const weatherThemeMap: Record<
  string,
  {
    backgroundGradient?: string; 
    backgroundImage?: string; 
    characterImage?: string;
  }
> = {
  CLEAR: {
    backgroundImage: '/images/bg-clear.png',
    characterImage: '/images/clear-character.png',
  },
  RAIN: {
    backgroundImage: '/images/bg-rain.jpg',
    characterImage: '/images/rain-character.png',
  },
  SNOW: {
    backgroundImage: '/images/bg-snow.jpg',
    characterImage: '/images/snow-character.png',
  },
  CLOUDS: {
    backgroundImage: '/images/bg-cloud.jpg',
    characterImage: '/images/cloud-character.png',
  },
  DEFAULT: {
    backgroundImage: '/images/bg-default.jpg',
    characterImage: '',
  },
};
