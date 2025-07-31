"use client";

import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import type { components } from "@/lib/backend/apiV1/schema";
import { apiFetch } from "@/lib/backend/client";
import Link from "next/link";
import { Search, X, Plus, ChevronLeft, ChevronRight, Calendar, MapPin, Thermometer } from "lucide-react";

type CommentDto = components["schemas"]["CommentDto"];

interface SearchFilters {
    location?: string;
    feelsLikeTemperature?: number;
    month?: number;
}

export default function Page() {
    const [comments, setComments] = useState<CommentDto[] | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const [filters, setFilters] = useState<SearchFilters>({});
    const [tempFilterInputs, setTempFilterInputs] = useState({
        location: "",
        feelsLikeTemperature: "",
        month: ""
    });

    const fetchComments = async (currentPage: number, searchFilters: SearchFilters) => {
        let queryParams = `page=${currentPage}&size=10`;

        if (searchFilters.location) queryParams += `&location=${encodeURIComponent(searchFilters.location)}`;
        if (searchFilters.feelsLikeTemperature !== undefined) queryParams += `&feelsLikeTemperature=${searchFilters.feelsLikeTemperature}`;
        if (searchFilters.month !== undefined) queryParams += `&month=${searchFilters.month}`;

        apiFetch(`/api/v1/comments?${queryParams}`).then((res) => {
            setComments(res.content || []);
            setTotalPages(res.totalPages ?? 0);
            setTotalElements(res.totalElements);
        }).catch((error) => {
            alert(`${error.resultCode} : ${error.msg}`);
        })
    };

    useEffect(() => {
        fetchComments(page, filters);
    }, [page, filters]);

    // 검색 실행
    const handleSearch = () => {
        const newFilters: SearchFilters = {};

        if (tempFilterInputs.location.trim()) {
            newFilters.location = tempFilterInputs.location.trim();
        }
        if (tempFilterInputs.feelsLikeTemperature && !isNaN(Number(tempFilterInputs.feelsLikeTemperature))) {
            newFilters.feelsLikeTemperature = Number(tempFilterInputs.feelsLikeTemperature);
        }
        if (tempFilterInputs.month && !isNaN(Number(tempFilterInputs.month))) {
            const monthNum = Number(tempFilterInputs.month);
            if (monthNum >= 1 && monthNum <= 12) {
                newFilters.month = monthNum;
            }
        }

        setFilters(newFilters);
        setPage(0); // 검색할 때는 첫 페이지로 이동
        setIsFilterExpanded(false);
    };

    const handleReset = () => {
        setTempFilterInputs({
            location: "",
            feelsLikeTemperature: "",
            month: ""
        });
        setFilters({});
        setPage(0);
    };

    const handleFilterChange = (field: keyof typeof tempFilterInputs, value: string) => {
        setTempFilterInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCreate = (comment: CommentDto) => {
        setComments([comment, ...(comments || [])]);
        setShowModal(false);
    };

    const removeFilter = (filterKey: keyof SearchFilters) => {
        const newFilters = { ...filters };
        delete newFilters[filterKey];
        setFilters(newFilters);
        setPage(0);
    };

    const hasActiveFilters = Object.keys(filters).length > 0;

    if (comments === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <Link href="/comments" className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            WearLog
                        </Link>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">코멘트 작성</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 py-6 max-w-7xl mx-auto">
                {/* Search Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                    <div className="p-4">
                        <button
                            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                            className="flex items-center justify-between w-full text-left"
                        >
                            <div className="flex items-center gap-2">
                                <Search size={20} className="text-gray-400" />
                                <span className="font-medium text-gray-700">검색 및 필터</span>
                            </div>
                            <ChevronRight 
                                size={20} 
                                className={`text-gray-400 transition-transform ${isFilterExpanded ? 'rotate-90' : ''}`} 
                            />
                        </button>
                        <div className={`transition-all duration-300 ease-in-out ${isFilterExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                            <div className="pt-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={tempFilterInputs.location}
                                            onChange={(e) => handleFilterChange('location', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="지역 검색"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Thermometer size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            value={tempFilterInputs.feelsLikeTemperature}
                                            onChange={(e) => handleFilterChange('feelsLikeTemperature', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="온도 (°C)"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            min="1"
                                            max="12"
                                            value={tempFilterInputs.month}
                                            onChange={(e) => handleFilterChange('month', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="월 (1-12)"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSearch}
                                        className="flex-1 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium"
                                    >
                                        검색하기
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium"
                                    >
                                        초기화
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {hasActiveFilters && (
                        <div className="px-4 pb-4">
                            <div className="flex flex-wrap gap-2">
                                {filters.location && (
                                    <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                        <MapPin size={14} />
                                        <span>{filters.location}</span>
                                        <button
                                            onClick={() => removeFilter('location')}
                                            className="hover:bg-blue-200 rounded-full p-0.5"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                                {filters.feelsLikeTemperature !== undefined && (
                                    <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                                        <Thermometer size={14} />
                                        <span>{filters.feelsLikeTemperature}°C</span>
                                        <button
                                            onClick={() => removeFilter('feelsLikeTemperature')}
                                            className="hover:bg-orange-200 rounded-full p-0.5"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                                {filters.month !== undefined && (
                                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                        <Calendar size={14} />
                                        <span>{filters.month}월</span>
                                        <button
                                            onClick={() => removeFilter('month')}
                                            className="hover:bg-green-200 rounded-full p-0.5"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                {hasActiveFilters && (
                    <div className="text-sm text-gray-600 mb-4 px-1">
                        검색 결과: 총 <span className="font-semibold text-blue-600">{totalElements}</span>건
                    </div>
                )}

                {/* Empty State */}
                {comments.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <Search size={48} className="mx-auto" />
                        </div>
                        <p className="text-gray-500 text-lg">글이 없습니다</p>
                        <p className="text-gray-400 text-sm mt-2">새로운 코멘트를 작성해보세요!</p>
                    </div>
                )}

                {/* Comments List */}
                <div className="space-y-3 mb-8">
                    {comments.map((comment, index) => (
                        <div 
                            key={comment.id} 
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] overflow-hidden"
                        >
                            <Link href={`/comments/${comment.id}`}>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs md:text-sm font-mono text-gray-600 py-1">
                                            #{totalElements - (page * 10 + index)}
                                        </span>
                                        <h4 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                                            {comment.title}
                                        </h4>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                        <span className="truncate">{comment.email}</span>
                                        <span className="text-xs text-gray-400 text-right">
                                            {new Date(comment.weatherInfoDto.date).toLocaleDateString("ko-KR")}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs">
                                        {comment.weatherInfoDto.location && (
                                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                                                <MapPin size={12} />
                                                <span>{comment.weatherInfoDto.location}</span>
                                            </div>
                                        )}
                                        {comment.weatherInfoDto.feelsLikeTemperature && (
                                            <div className="flex items-center gap-1 text-blue-600 bg-gray-50 px-2 py-1 rounded-md">
                                                <Thermometer size={12} />
                                                <span>{comment.weatherInfoDto.feelsLikeTemperature}°C</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95"
                        >
                            <ChevronLeft size={16} />
                            <span className="hidden sm:inline">이전</span>
                        </button>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">
                                {page + 1}
                            </span>
                            <span className="text-sm text-gray-400">of</span>
                            <span className="text-sm font-medium text-gray-700">
                                {totalPages}
                            </span>
                        </div>
                        
                        <button
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage(page + 1)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95"
                        >
                            <span className="hidden sm:inline">다음</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {showModal && (
                <Modal onClose={() => setShowModal(false)} onCreate={handleCreate} />
            )}
        </div>
    );
}
