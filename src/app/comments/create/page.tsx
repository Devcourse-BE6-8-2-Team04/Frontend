"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/backend/client";
import type { components } from "@/lib/backend/apiV1/schema";
import Link from "next/link";

type GeoLocationDto = components["schemas"]["GeoLocationDto"];

export default function CreateCommentPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchResults, setSearchResults] = useState<GeoLocationDto[]>([]);
    const [showLocationResults, setShowLocationResults] = useState(false);

    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        title: "",
        sentence: "",
        tagString: "",
        imageUrl: "",
        cityName: "",
        countryCode: "",
        date: new Date().toISOString().split('T')[0], // 오늘 날짜로 기본값
    });

    // 입력값 변경 핸들러
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 도시 검색 함수
    const searchCities = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowLocationResults(false);
            return;
        }

        try {
            const results = await apiFetch(`/api/v1/geos?location=${encodeURIComponent(query)}`);
            setSearchResults(results);
            setShowLocationResults(true);
        } catch (error) {
            console.error("도시 검색 실패:", error);
            setSearchResults([]);
        }
    };

    // 도시 선택 핸들러
    const handleCitySelect = (location: GeoLocationDto) => {
        setFormData(prev => ({
            ...prev,
            cityName: location.name,
            countryCode: location.country
        }));
        setShowLocationResults(false);
        setSearchResults([]);
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 필수 필드 검증
        if (!formData.email || !formData.password || !formData.title ||
            !formData.sentence || !formData.cityName || !formData.countryCode) {
            alert("필수 항목을 모두 입력해주세요.");
            return;
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("올바른 이메일 형식을 입력해주세요.");
            return;
        }

        // 비밀번호 길이 검증
        if (formData.password.length < 4) {
            alert("비밀번호는 4자 이상이어야 합니다.");
            return;
        }

        try {
            setIsSubmitting(true);

            await apiFetch("/api/v1/comments", {
                method: "POST",
                body: JSON.stringify(formData),
            });

            alert("코멘트가 성공적으로 작성되었습니다!");
            router.push("/comments");
        } catch (error: any) {
            console.error("코멘트 작성 실패:", error);
            alert(error.msg || "코멘트 작성에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto">
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-6">
                    <Link href="/comments" className="text-3xl font-bold text-gray-800">
                        WearLog
                    </Link>
                    <Link
                        href="/comments"
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                        목록으로
                    </Link>
                </div>

                {/* 코멘트 작성 폼 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">코멘트 작성</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* 이메일 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                이메일 *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="example@email.com"
                                required
                            />
                        </div>

                        {/* 비밀번호 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                비밀번호 *
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="4자 이상 입력"
                                minLength={4}
                                required
                            />
                        </div>

                        {/* 제목 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                제목 *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="제목을 입력하세요"
                                minLength={2}
                                maxLength={100}
                                required
                            />
                        </div>

                        {/* 내용 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                내용 *
                            </label>
                            <textarea
                                value={formData.sentence}
                                onChange={(e) => handleInputChange('sentence', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="내용을 입력하세요"
                                rows={6}
                                minLength={2}
                                maxLength={500}
                                required
                            />
                        </div>

                        {/* 태그 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                태그
                            </label>
                            <input
                                type="text"
                                value={formData.tagString}
                                onChange={(e) => handleInputChange('tagString', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="#태그1#태그2 형식으로 입력"
                            />
                        </div>

                        {/* 이미지 URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                이미지 URL
                            </label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* 도시 검색 */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                도시 *
                            </label>
                            <input
                                type="text"
                                value={formData.cityName}
                                onChange={(e) => {
                                    handleInputChange('cityName', e.target.value);
                                    searchCities(e.target.value);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="도시명을 입력하세요"
                                required
                            />

                            {/* 도시 검색 결과 */}
                            {showLocationResults && searchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {searchResults.map((location, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleCitySelect(location)}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="font-medium">
                                                {location.localName || location.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {location.name}, {location.country}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 날짜 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                날짜 *
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* 제출 버튼 */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => router.push("/comments")}
                                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "작성 중..." : "작성하기"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}