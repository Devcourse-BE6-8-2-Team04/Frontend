// 캐릭터 이미지 경로 상수
export const CHARACTERS = {
    HOT_CLEAR: '/images/char-hot-clear.png',
    HOT_CLOUDY: '/images/char-hot-cloudy.png',
    HOT_RAINY: '/images/char-hot-rainy.png',
  
    NORMAL_CLEAR: '/images/char-normal-clear.png',
    NORMAL_CLOUDY: '/images/chchararacter-normal-cloudy.png',
    NORMAL_RAINY: '/images/char-normal-rainy.png',
  
    COLD_CLEAR: '/images/char-cold-clear.png',
    COLD_CLOUDY: '/images/char-cold-cloudy.png',
    COLD_RAINY: '/images/char-cold-rainy.png',
  
    DEFAULT: '/images/char-normal-clear.png',
  } as const;
  
  export type CharacterKey = keyof typeof CHARACTERS;
  
  // 기온 그룹 판별 (HOT / NORMAL / COLD)
  function getTempGroup(temp: number): 'HOT' | 'NORMAL' | 'COLD' {
    if (temp >= 28) return 'HOT';
    if (temp <= 10) return 'COLD';
    return 'NORMAL';
  }
  
  // 날씨 그룹 판별 (CLEAR / CLOUDY / RAINY)
  function getWeatherGroup(weather: string): 'CLEAR' | 'CLOUDY' | 'RAINY' {
    const upper = weather.toUpperCase();
  
    const rainyKeywords = [
      'RAIN', 'SNOW', 'DRIZZLE', 'FREEZING',
      'MIST', 'FOG', 'THUNDER', 'SQUALL', 'TORNADO',
    ];
    const cloudyKeywords = [
      'CLOUD', 'OVERCAST', 'DUST', 'HAZE', 'SMOKE', 'SAND', 'ASH',
    ];
  
    if (rainyKeywords.some(k => upper.includes(k))) return 'RAINY';
    if (cloudyKeywords.some(k => upper.includes(k))) return 'CLOUDY';
    return 'CLEAR';
  }
  
  // 캐릭터 이미지 반환
  export function getCharacterImage(temp: number, weather: string): string {
    const tempGroup = getTempGroup(temp);
    const weatherGroup = getWeatherGroup(weather);
  
    const key = `${tempGroup}_${weatherGroup}` as CharacterKey;
    return CHARACTERS[key] ?? CHARACTERS.DEFAULT;
  }
  