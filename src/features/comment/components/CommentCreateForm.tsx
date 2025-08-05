"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Thermometer, CalendarDays, Plus, Loader2, ImagePlus, ChevronLeft } from "lucide-react";

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

type CityCandidate = {
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
};

export function CommentCreateForm() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [locationCandidates, setLocationCandidates] = useState<CityCandidate[]>([]);
    const [selectedCity, setSelectedCity] = useState<CityCandidate | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [feelsLikeTemperature, setFeelsLikeTemperature] = useState("");
    const [month, setMonth] = useState("");
    const [date, setDate] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoadingWeather, setIsLoadingWeather] = useState(false);
    const [weatherError, setWeatherError] = useState("");
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 도시 자동검색
    useEffect(() => {
        if (!location || selectedCity?.name === location) {
            setLocationCandidates([]);
            setShowDropdown(false);
            return;
        }
        let abortController = new AbortController();
        async function fetchCities() {
            setIsLoadingCities(true);
            try {
                const res = await fetch(
                    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=5&appid=${OPENWEATHER_API_KEY}`,
                    { signal: abortController.signal }
                );
                const data = await res.json();
                setLocationCandidates(data);
                setShowDropdown(data.length > 0);
            } catch {
                setLocationCandidates([]);
                setShowDropdown(false);
            } finally {
                setIsLoadingCities(false);
            }
        }
        const timeout = setTimeout(fetchCities, 300);
        return () => {
            clearTimeout(timeout);
            abortController.abort();
        };
    }, [location]);

    // 체감온도 조회
    useEffect(() => {
        async function fetchWeather() {
            if (!selectedCity || !date) {
                setFeelsLikeTemperature("");
                return;
            }
            setIsLoadingWeather(true);
            setWeatherError("");
            try {
                const weatherRes = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
                );
                const weatherData = await weatherRes.json();
                if (weatherData?.main?.feels_like == null)
                    throw new Error("날씨 정보를 가져올 수 없습니다.");
                setFeelsLikeTemperature(String(weatherData.main.feels_like));
            } catch (err: any) {
                setFeelsLikeTemperature("");
                setWeatherError(err.message || "날씨 정보를 가져올 수 없습니다.");
            } finally {
                setIsLoadingWeather(false);
            }
        }
        fetchWeather();
    }, [selectedCity, date]);

    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 이미지 업로드 핸들러 (미리보기)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImageUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // 사진 등록 버튼 클릭
    const handleImageButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleTagAdd = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };
    const handleTagRemove = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    // 뒤로가기 버튼 핸들러 (CommentItem 스타일과 동일하게)
    const handleGoBack = () => {
        router.push("/comments");
    };

    // 폼 제출
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: 등록 로직
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-3xl mx-auto mt-10 p-8"
        >
            {/* 뒤로가기 버튼 (CommentItem 스타일 참고) */}
            <div className="mb-6">
                <button
                    type="button"
                    onClick={handleGoBack}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-150 transform hover:scale-105 active:scale-95"
                >
                    <ChevronLeft size={20} className="text-gray-600" />
                    <span className="text-sm font-medium">뒤로가기</span>
                </button>
            </div>

            {/* 제목 */}
            <input
                type="text"
                placeholder="제목을 입력하세요"
                className="w-full font-semibold text-xl md:text-2xl border-b border-gray-300 mb-4 py-2 focus:outline-none text-gray-900 bg-transparent placeholder-gray-400"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />

            {/* 이메일 및 날짜 */}
            <div className="flex items-center justify-between mb-2">
                <input
                    type="email"
                    placeholder="이메일"
                    className="text-sm text-gray-800 font-mono py-1 focus:outline-none bg-gray-50 px-2 rounded-lg border border-gray-200"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="date"
                    className="text-sm text-gray-800 py-1 px-2 rounded-lg bg-gray-50 focus:outline-none border border-gray-200"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                />
            </div>

            {/* 날씨 정보 */}
            <div className="flex gap-2 mb-4 items-center">
                <div className="relative w-52" ref={dropdownRef}>
                    <div className="flex items-center gap-1 bg-gray-20 text-gray-800 px-2 py-1 rounded-lg border border-gray-200">
                        <MapPin size={16} />
                        <input
                            type="text"
                            placeholder="도시 검색"
                            className="bg-transparent focus:outline-none text-xs text-gray-900 w-full placeholder-gray-400"
                            value={location}
                            onChange={e => {
                                setLocation(e.target.value);
                                setSelectedCity(null);
                            }}
                            onFocus={() => setShowDropdown(locationCandidates.length > 0)}
                            autoComplete="off"
                            required
                        />
                        {isLoadingCities && <Loader2 className="animate-spin ml-1" size={16} />}
                    </div>
                    {showDropdown && (
                        <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-sm max-h-48 overflow-auto">
                            {locationCandidates.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-400">검색 결과 없음</div>
                            ) : (
                                locationCandidates.map((city, idx) => (
                                    <div
                                        key={city.lat + city.lon + idx}
                                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-900 transition"
                                        onClick={() => {
                                            setSelectedCity(city);
                                            setLocation(city.name + (city.state ? `, ${city.state}` : "") + `, ${city.country}`);
                                            setShowDropdown(false);
                                        }}
                                    >
                                        {city.name} {city.state ? `, ${city.state}` : ""} ({city.country})
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1 text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                    <Thermometer size={17} />
                    <input
                        type="number"
                        placeholder="체감온도(°C)"
                        className="bg-transparent focus:outline-none text-xs w-24 text-gray-900 placeholder-gray-400"
                        value={feelsLikeTemperature}
                        readOnly
                        required
                    />
                    {isLoadingWeather && <Loader2 className="animate-spin text-gray-400 ml-2" size={16} />}
                    {weatherError && <span className="text-xs text-red-500 ml-2">{weatherError}</span>}
                </div>
                <div className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-lg border border-gray-200">
                    <CalendarDays size={16} />
                    <input
                        type="number"
                        min={1}
                        max={12}
                        placeholder="월"
                        className="bg-transparent focus:outline-none text-xs w-10 text-gray-900 placeholder-gray-400"
                        value={month}
                        onChange={e => setMonth(e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* 내용 */}
            <textarea
                placeholder="내용을 입력하세요"
                className="
                    w-full min-h-[200px] text-base text-gray-900
                    mb-4 py-3 px-4 focus:outline-none
                    border border-gray-200 rounded-xl
                    bg-gradient-to-br from-gray-50 to-white
                    shadow-[inset_0_1px_6px_0_rgba(0,0,0,0.09)]
                    focus:border-blue-400
                    placeholder-gray-400
                    transition
                "
                value={content}
                onChange={e => setContent(e.target.value)}
                required
            />

            {/* 태그 */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-800">태그</span>
                    <input
                        type="text"
                        placeholder="#태그 입력 후 Enter"
                        className="bg-gray-50 focus:outline-none px-2 py-1 text-xs rounded-lg text-gray-900 border border-gray-200 placeholder-gray-400"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" ? (e.preventDefault(), handleTagAdd()) : undefined}
                    />
                    <button
                        type="button"
                        onClick={handleTagAdd}
                        className="bg-blue-200 text-blue-800 px-2 py-1 rounded-lg text-xs font-semibold shadow-sm transition hover:bg-blue-300 hover:scale-105 active:scale-95"
                    >
                        <Plus size={14} />
                    </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-900 px-2 py-1 rounded-lg text-xs cursor-pointer border border-blue-200 shadow-sm"
                              onClick={() => handleTagRemove(tag)}>
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* 이미지 업로드/미리보기 */}
            <div className="mb-6">
                <label className="block text-xs text-gray-800 mb-2 font-semibold">이미지</label>
                <button
                    type="button"
                    onClick={handleImageButtonClick}
                    className="
                        flex items-center gap-2 px-4 py-2 mb-2
                        bg-white border border-blue-200 text-blue-900 font-semibold rounded-xl
                        shadow-sm
                        hover:bg-blue-50 hover:text-blue-900 hover:shadow-md
                        transition-all duration-150 transform hover:scale-105 active:scale-95
                        focus:outline-none
                    "
                >
                    <ImagePlus size={20} />
                    사진 등록하기
                </button>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={fileInputRef}
                />
                {imageUrl && (
                    <div className="w-full h-80 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm border border-gray-200 mt-2">
                        <img src={imageUrl} alt="미리보기" className="max-w-full max-h-[19rem] object-contain" />
                    </div>
                )}
            </div>

            {/* 제출 */}
            <button
                type="submit"
                className="
                    w-full py-3 mt-3
                    bg-blue-900 text-white rounded-xl font-semibold shadow-sm
                    border border-blue-900
                    transition-all duration-150
                    hover:bg-blue-800 hover:scale-105 active:scale-95
                    focus:outline-none
                "
            >
                등록
            </button>
        </form>
    );
}