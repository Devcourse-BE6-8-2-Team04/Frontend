export interface WeatherInfo {
    id: number;
    weather: string;
    description?: string;
    dailyTemperatureGap: number;
    feelsLikeTemperature: number;
    maxTemperature: number;
    minTemperature: number;
    pop?: number;
    rain?: number;
    snow?: number;
    humidity?: number;
    windSpeed?: number;
    windDeg?: number;
    uvi?: number;
    location: string;
    date: string;
  }
  