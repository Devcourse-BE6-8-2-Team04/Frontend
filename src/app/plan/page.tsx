'use client';

import { useState, useRef, createRef, useEffect } from 'react';
import Image from 'next/image';

// 데이터 구조에 대한 타입 정의
interface Cloth {
  id: number;
  clothName: string;
  imageUrl: string;
  category: string;
  maxFeelsLike: number;
  minFeelsLike: number;
}

interface ExtraCloth {
  id: number;
  clothName: string;
  imageUrl: string;
  weather: string;
}

interface ClothApiResponse {
  clothes: {
    [category: string]: Cloth[];
  };
  extraClothes: {
    EXTRA: ExtraCloth[];
  };
}

interface Weather {
    id: number;
    weather: string;
    description: string;
    dailyTemperatureGap: number;
    feelsLikeTemperature: number;
    maxTemperature: number;
    minTemperature: number;
    pop: number;
    rain: number;
    snow: number;
    humidity: number;
    windSpeed: number;
    windDeg: number;
    uvi: number;
    location: string;
    date: string;
}

interface WeatherApiResponse extends Array<Weather>{}

interface Geo {
    name: string;
    country: string;
    lat: number;
    lon: number;
    localName: string;
}

interface GeoApiResponse extends Array<Geo>{}


interface ScrollState {
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

export default function Plan() {
  const [destination, setDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [clothData, setClothData] = useState<ClothApiResponse | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [locationName, setLocationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState('');

  const scrollRefs = useRef<{
    [key: string]: React.RefObject<HTMLDivElement>
  }>({});
  const [scrollStates, setScrollStates] = useState<{
    [key: string]: ScrollState
  }>({});

  const handleConfirm = async () => {
    setWarningMessage('');
    setError(null);
    setClothData(null);
    setWeatherData(null);
    setLocationName('');

    if (!destination || !checkInDate || !checkOutDate) {
      setError('모든 필드를 채워주세요.');
      return;
    }

    const depDate = new Date(checkInDate);
    const arrDate = new Date(checkOutDate);

    if (arrDate < depDate) {
      setWarningMessage('체크아웃 날짜는 체크인 날짜보다 빠를 수 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Geos API 호출
      const geoResponse = await fetch(`/api/v1/geos?location=${destination}`);
      if (!geoResponse.ok) {
        throw new Error(`Geos API error! status: ${geoResponse.status}`);
      }
      const geoData: GeoApiResponse = await geoResponse.json();
      if (!geoData || geoData.length === 0) {
        throw new Error('해당 위치를 찾을 수 없습니다.');
      }
      const locationInfo = geoData[0];
      setLocationName(locationInfo.localName);

      // 2. Cloth 및 Weather API 동시 호출
      const clothParams = new URLSearchParams({
        place: locationInfo.name,
        start: checkInDate,
        end: checkOutDate,
      });
      const weatherParams = new URLSearchParams({
        location: locationInfo.name,
        start: checkInDate,
        end: checkOutDate,
        lat: locationInfo.lat.toString(),
        lon: locationInfo.lon.toString(),
      });

      const [clothResponse, weatherResponse] = await Promise.all([
        fetch(`/api/v1/cloth?${clothParams.toString()}`),
        fetch(`/api/v1/weathers/location?${weatherParams.toString()}`)
      ]);

      if (!clothResponse.ok || !weatherResponse.ok) {
        throw new Error(`API error! cloth: ${clothResponse.status}, weather: ${weatherResponse.status}`);
      }

      const [clothResult, weatherResult] = await Promise.all([
        clothResponse.json(),
        weatherResponse.json()
      ]);

      setClothData(clothResult);
      setWeatherData(weatherResult);

      // 3. 스크롤 관련 Ref 및 State 설정
      const newRefs: { [key: string]: React.RefObject<HTMLDivElement> } = {};
      const newScrollStates: { [key: string]: ScrollState } = {};

      if (weatherResult && weatherResult.length > 0) {
        newRefs['weather'] = createRef<HTMLDivElement>();
        newScrollStates['weather'] = { canScrollLeft: false, canScrollRight: true };
      }

      Object.keys(clothResult.clothes).forEach(category => {
        newRefs[category] = createRef<HTMLDivElement>();
        newScrollStates[category] = { canScrollLeft: false, canScrollRight: true };
      });
      if (clothResult.extraClothes.EXTRA) {
        newRefs['extra'] = createRef<HTMLDivElement>();
        newScrollStates['extra'] = { canScrollLeft: false, canScrollRight: true };
      }
      scrollRefs.current = newRefs;
      setScrollStates(newScrollStates);

    } catch (err: any) {
      console.error('API 요청 에러:', err);
      setError(err.message || 'API 요청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkScrollability = (key: string) => {
    const ref = scrollRefs.current[key];
    if (ref && ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      const canScrollLeft = scrollLeft > 0;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth;
      setScrollStates(prev => ({ ...prev, [key]: { canScrollLeft, canScrollRight } }));
    }
  };

  useEffect(() => {
    Object.keys(scrollRefs.current).forEach(key => {
        checkScrollability(key);
    });
  }, [clothData, weatherData]);

  const handleScroll = (key: string, direction: 'left' | 'right') => {
    const ref = scrollRefs.current[key];
    if (ref && ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(() => checkScrollability(key), 500);
    }
  };

  const renderWeatherResults = () => {
    if (!weatherData) return null;
    
    return (
      <div className="mb-8 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">{locationName} 날씨 정보</h2>
        <button onClick={() => handleScroll('weather', 'left')} disabled={!scrollStates['weather']?.canScrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full z-10 disabled:opacity-50 disabled:cursor-not-allowed">&lt;</button>
        <div ref={scrollRefs.current['weather']} onScroll={() => checkScrollability('weather')} className="flex overflow-x-auto space-x-4 p-2 scroll-smooth scrollbar-hide">
            {weatherData.map(weather => (
                <div key={weather.id} className="flex-shrink-0 w-48 border rounded-lg p-4 shadow">
                    <p className="font-semibold">{weather.date}</p>
                    <p>최고/최저: {weather.maxTemperature}°/{weather.minTemperature}°</p>
                    <p>체감: {weather.feelsLikeTemperature}°C</p>
                    <p>하늘: {weather.description}</p>
                    <p>강수: {weather.pop}%</p>
                </div>
            ))}
        </div>
        <button onClick={() => handleScroll('weather', 'right')} disabled={!scrollStates['weather']?.canScrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full z-10 disabled:opacity-50 disabled:cursor-not-allowed">&gt;</button>
      </div>
    );
  };

  const renderClothResults = () => {
    if (!clothData) return null;

    return (
      <div className="w-full">
        {Object.entries(clothData.clothes).map(([category, clothes]) => (
          <div key={category} className="mb-8 relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">{category}</h2>
            <button onClick={() => handleScroll(category, 'left')} disabled={!scrollStates[category]?.canScrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full z-10 disabled:opacity-50 disabled:cursor-not-allowed">&lt;</button>
            <div ref={scrollRefs.current[category]} onScroll={() => checkScrollability(category)} className="flex overflow-x-auto space-x-4 p-2 scroll-smooth scrollbar-hide">
              {clothes.map((cloth) => (
                <div key={cloth.id} className="flex-shrink-0 w-48 border rounded-lg shadow-md overflow-hidden">
                  <div className="relative w-full h-40">
                    <Image src={cloth.imageUrl} alt={cloth.clothName} layout="fill" objectFit="cover" />
                  </div>
                  <div className="p-2 text-center">
                    <p className="font-semibold text-gray-700">{cloth.clothName}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => handleScroll(category, 'right')} disabled={!scrollStates[category]?.canScrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full z-10 disabled:opacity-50 disabled:cursor-not-allowed">&gt;</button>
          </div>
        ))}

        {clothData.extraClothes.EXTRA && clothData.extraClothes.EXTRA.length > 0 && (
          <div className="mb-8 relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">챙겨가면 좋은 것들</h2>
            <button onClick={() => handleScroll('extra', 'left')} disabled={!scrollStates['extra']?.canScrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full z-10 disabled:opacity-50 disabled:cursor-not-allowed">&lt;</button>
            <div ref={scrollRefs.current['extra']} onScroll={() => checkScrollability('extra')} className="flex overflow-x-auto space-x-4 p-2 scroll-smooth scrollbar-hide">
              {clothData.extraClothes.EXTRA.map((item) => (
                <div key={item.id} className="flex-shrink-0 w-48 border rounded-lg shadow-md overflow-hidden">
                  <div className="relative w-full h-40">
                    <Image src={item.imageUrl} alt={item.clothName} layout="fill" objectFit="cover" />
                  </div>
                  <div className="p-2 text-center">
                    <p className="font-semibold text-gray-700">{item.clothName}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => handleScroll('extra', 'right')} disabled={!scrollStates['extra']?.canScrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full z-10 disabled:opacity-50 disabled:cursor-not-allowed">&gt;</button>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-gray-500">로딩 중...</div>;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (!clothData && !weatherData) {
      return <div className="text-gray-500">API 요청 결과가 여기에 표시됩니다.</div>;
    }

    return (
        <div className="w-full">
            {renderWeatherResults()}
            {renderClothResults()}
        </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl mt-10 p-6 bg-white rounded-lg shadow-lg flex items-end gap-4">
        <div className="flex flex-col flex-grow">
          <label htmlFor="destination" className="text-base font-semibold text-gray-700 mb-2">여행지</label>
          <input
            type="text"
            id="destination"
            placeholder="어디로 떠나시나요?"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-grow">
          <label htmlFor="checkInDate" className="text-base font-semibold text-gray-700 mb-2">체크인</label>
          <input
            type="date"
            id="checkInDate"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-grow">
          <label htmlFor="checkOutDate" className="text-base font-semibold text-gray-700 mb-2">체크아웃</label>
          <input
            type="date"
            id="checkOutDate"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
          />
        </div>
        <button
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0"
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? '로딩중...' : '확인'}
        </button>
      </div>
      
      <div className="w-full max-w-5xl mt-10 p-6 bg-white rounded-lg shadow-lg min-h-[24rem] flex items-center justify-center">
        {renderContent()}
      </div>

      {warningMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" onClick={() => setWarningMessage('')}>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center z-50" onClick={(e) => e.stopPropagation()}>
            <p className="text-lg font-semibold text-red-600 mb-4">{warningMessage}</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setWarningMessage('')}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
