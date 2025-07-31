"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Navigation } from "lucide-react";
import WeeklyForecastSwiper from "@/components/WeeklyForecastSwiper";

export default function PullToRevealSearch() {
  const [offset, setOffset] = useState(0);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [canPull, setCanPull] = useState(true);

  const startYRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveToLocal = (list: string[]) => {
    localStorage.setItem("recentSearches", JSON.stringify(list));
  };

  const handleScroll = () => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    const scrollTop = el.scrollTop;
    const hasScroll = el.scrollHeight > el.clientHeight;

    // 스크롤 가능한 경우에만 최상단에서 pull 허용
    setCanPull(!hasScroll || scrollTop <= 0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const scrollTop = contentRef.current?.scrollTop ?? 0;
    const hasScroll =
      contentRef.current &&
      contentRef.current.scrollHeight > contentRef.current.clientHeight;

    if ((hasScroll && scrollTop > 0) || !canPull) return;

    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startYRef.current === null) return;

    const currentY = e.touches[0].clientY;
    const startY = startYRef.current;
    const diff = currentY - startY;

    if (diff > 0 && diff < 150) {
      setOffset(diff);
    } else if (diff < 0 && offset > 0) {
      setOffset((prev) => Math.max(0, prev + diff));
    }
  };

  const handleTouchEnd = () => {
    if (offset >= 50) {
      setOffset(80);
      setIsSearchVisible(true);
    } else {
      setOffset(0);
      setIsSearchVisible(false);
    }
    startYRef.current = null;
  };

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter((item) => item !== trimmed),
    ].slice(0, 5);
    setRecentSearches(updated);
    saveToLocal(updated);

    setSearchResults([`${trimmed} 시청`, `${trimmed} 구청`, `${trimmed}역`]);
    setIsSearching(true);
  };

  const handleSelectResult = (location: string) => {
    const dummyWeather = [
      {
        id: 2001,
        location,
        date: new Date().toLocaleDateString(),
        weather: "Rain",
        feelsLikeTemperature: 24,
        maxTemperature: 26,
        minTemperature: 21,
        description: "비",
      },
    ];

    window.dispatchEvent(
      new CustomEvent("weather:update", { detail: dummyWeather })
    );

    setShowOverlay(false);
    setOffset(0);
    setQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        const dummyWeather = [
          {
            id: 3001,
            location: `위도 ${latitude.toFixed(2)}, 경도 ${longitude.toFixed(
              2
            )}`,
            date: new Date().toLocaleDateString(),
            weather: "Clouds",
            feelsLikeTemperature: 22,
            maxTemperature: 25,
            minTemperature: 20,
            description: "흐림",
          },
        ];

        window.dispatchEvent(
          new CustomEvent("weather:update", { detail: dummyWeather })
        );

        setShowOverlay(false);
        setOffset(0);
        setQuery("");
        setSearchResults([]);
        setIsSearching(false);
      },
      () => {
        alert("위치 정보를 가져올 수 없습니다.");
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const removeRecent = (item: string) => {
    const updated = recentSearches.filter((v) => v !== item);
    setRecentSearches(updated);
    saveToLocal(updated);
  };

  const closeOverlay = () => {
    setOffset(0);
    setShowOverlay(false);
    setQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 검색 오버레이 */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black text-white z-50 overflow-y-auto">
          <div className="h-[80px] bg-gray-800 flex items-center justify-center px-4 shadow-md">
            <div className="flex items-center gap-2 w-full max-w-md bg-gray-900 rounded px-3 py-1.5">
              <input
                type="text"
                placeholder="도시명을 입력하세요"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 p-1 bg-transparent text-white placeholder-gray-300 focus:outline-none text-base"
                autoFocus
              />
              <button
                onClick={handleSearch}
                className="text-gray-300 hover:text-white"
              >
                <Search size={20} />
              </button>
              <button
                onClick={closeOverlay}
                className="text-gray-300 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="px-4 py-6">
            <div className="max-w-md mx-auto space-y-6">
              {!isSearching && (
                <>
                  <div
                    className="flex items-center gap-2 text-white cursor-pointer"
                    onClick={handleCurrentLocation}
                  >
                    <Navigation size={20} />
                    <span className="text-base">현재위치</span>
                  </div>

                  {recentSearches.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-400 mb-2">
                        최근 검색어
                      </div>
                      <ul className="space-y-2">
                        {recentSearches.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2 text-gray-300"
                          >
                            <button
                              onClick={() => {
                                setQuery(item);
                                setIsSearching(true);
                                setSearchResults([
                                  `${item} 시청`,
                                  `${item} 구청`,
                                  `${item}역`,
                                ]);
                              }}
                              className="hover:text-white text-base"
                            >
                              {item}
                            </button>
                            <button
                              onClick={() => removeRecent(item)}
                              className="text-gray-400 hover:text-white"
                            >
                              <X size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {searchResults.length > 0 && (
                <div>
                  <div className="text-sm text-gray-400 mb-2">검색 결과</div>
                  <ul className="space-y-2">
                    {searchResults.map((item) => (
                      <li
                        key={item}
                        className="cursor-pointer hover:text-white text-gray-300 text-base"
                        onClick={() => handleSelectResult(item)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 검색창 당기기 UI */}
      <div
        className="absolute top-[-80px] left-0 w-full transition-transform duration-200"
        style={{ transform: `translateY(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="h-[80px] bg-gray-800 text-white flex items-center justify-center px-4">
          <div className="flex items-center gap-2 w-full max-w-md bg-gray-900 rounded px-3 py-1.5">
            <input
              type="text"
              placeholder="도시명을 입력하세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowOverlay(true)}
              className="flex-1 p-1 bg-transparent text-white placeholder-gray-300 focus:outline-none text-base"
            />
            <button
              onClick={handleSearch}
              className="text-gray-300 hover:text-white"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* 날씨 콘텐츠 */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className={`transition-all duration-300 ${
            isSearchVisible
              ? "h-screen overflow-hidden"
              : "h-auto max-h-screen overflow-y-auto"
          }`}
        >
          <WeeklyForecastSwiper />
        </div>
      </div>
    </div>
  );
}
