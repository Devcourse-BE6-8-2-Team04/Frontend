"use client";

import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import type { components } from "@/lib/backend/apiV1/schema";
import { apiFetch } from "@/lib/backend/client";
import Link from "next/link";

type CommentDto = components["schemas"]["CommentDto"];

// 검색 필터 타입 정의
interface SearchFilters {
    location?: string;
    feelsLikeTemperature?: number;
    month?: number;
}

export default function Page() {
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // 검색 필터 상태
    const [filters, setFilters] = useState<SearchFilters>({});
    const [tempFilterInputs, setTempFilterInputs] = useState({
        location: "",
        feelsLikeTemperature: "",
        month: ""
    })

    // API 호출 함수
    const fetchComments = async (currentPage: number, searchFilters: SearchFilters) => {
        let queryParams = `page=${currentPage}&size=10`;
        
        // 검색 조건이 있을 때만 쿼리 파라미터에 추가
        if (searchFilters.location) {
            queryParams += `&location=${encodeURIComponent(searchFilters.location)}`;
        }
        if (searchFilters.feelsLikeTemperature !== undefined && searchFilters.feelsLikeTemperature !== null) {
            queryParams += `&feelsLikeTemperature=${searchFilters.feelsLikeTemperature}`;
        }
        if (searchFilters.month !== undefined && searchFilters.month !== null) {
            queryParams += `&month=${searchFilters.month}`;
        }

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
    };

    // 검색 초기화
    const handleReset = () => {
        setTempFilterInputs({
            location: "",
            feelsLikeTemperature: "",
            month: ""
        });
        setFilters({});
        setPage(0);
    };

    // 입력값 변경 핸들러
    const handleFilterChange = (field: keyof typeof tempFilterInputs, value: string) => {
        setTempFilterInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 코멘트 등록
    const handleCreate = (comment: CommentDto) => {
        setComments([comment, ...comments]);
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
                <Link href={`/comments`} className="text-3xl font-bold text-gray-800">WearLog</Link>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                >
                    코멘트 작성
                </button>
            </div>

            {/* 검색 필터 섹션 */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            지역
                        </label>
                        <input
                            type="text"
                            value={tempFilterInputs.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            placeholder="지역 입력"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            온도 (°C)
                        </label>
                        <input
                            type="number"
                            value={tempFilterInputs.feelsLikeTemperature}
                            onChange={(e) => handleFilterChange('feelsLikeTemperature', e.target.value)}
                            placeholder="온도 입력"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            월 (1-12)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="12"
                            value={tempFilterInputs.month}
                            onChange={(e) => handleFilterChange('month', e.target.value)}
                            placeholder="월 입력"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                            검색
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
                        >
                            초기화
                        </button>
                    </div>
                </div>
                
                {/* 현재 적용된 필터 표시 */}
                {(filters.location || filters.feelsLikeTemperature !== undefined || filters.month !== undefined) && (
                    <div className="mt-3 p-2 bg-blue-100 rounded">
                        <span className="text-sm text-gray-700">적용된 필터: </span>
                        {filters.location && <span className="text-sm bg-blue-200 px-2 py-1 rounded mr-2">지역: {filters.location}</span>}
                        {filters.feelsLikeTemperature !== undefined && <span className="text-sm bg-blue-200 px-2 py-1 rounded mr-2">온도: {filters.feelsLikeTemperature}°C</span>}
                        {filters.month !== undefined && <span className="text-sm bg-blue-200 px-2 py-1 rounded mr-2">월: {filters.month}월</span>}
                    </div>
                )}
            </div>


            {/* 코멘트 목록 */}
            {comments.length == 0 && <div>글이 없습니다.</div>}
            {comments.length > 0 && (
                <table className="min-w-full table-auto border-separate border-spacing-y-2">
                    <thead>
                        <tr className="bg-gray-200 text-gray-800 text-left text-sm uppercase tracking-wider">
                            <th className="px-4 py-3 text-center">번호</th>
                            <th className="px-4 py-3">내용</th>
                            <th className="px-4 py-3">이메일</th>
                            <th className="px-4 py-3">작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.map((comment, index) => (
                            <tr
                                key={comment.id}
                                className="bg-white hover:bg-gray-50 transition-shadow shadow-sm rounded-md"
                            >
                                <td className="px-4 py-3 text-center font-mono text-sm text-gray-600">
                                    {totalElements - (page * 10 + index)}
                                </td>
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/comments/${comment.id}`}
                                        className="text-gray-600 hover:underline font-medium"
                                    >
                                        {comment.sentence}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs">
                                    {comment.email}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                    {new Date(comment.weatherInfoDto.date).toLocaleDateString("ko-KR", {
                                        year: "numeric", month: "2-digit", day: "2-digit",
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="mt-6 flex justify-center space-x-4">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
                >
                    이전
                </button>
                <span className="text-black">{page + 1} / {totalPages}</span>
                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
                >
                    다음
                </button>
            </div>

            {showModal && (
                <Modal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreate}
                />
            )}
        </div>
    );
}