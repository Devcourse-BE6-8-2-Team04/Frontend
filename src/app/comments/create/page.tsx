// src/app/comments/create/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, PenTool } from "lucide-react";
import { apiFetch } from "@/lib/backend/client";
import type { components } from "@/lib/backend/apiV1/schema";

type CommentDto = components["schemas"]["CommentDto"];

export default function CreateCommentPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        title: "",
        sentence: "",
        tagString: "",
        imageUrl: "",
        countryCode: "KR",
        cityName: "",
        date: new Date().toISOString().split('T')[0]
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.email.trim()) {
            newErrors.email = "이메일을 입력해주세요.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "올바른 이메일 형식을 입력해주세요.";
        }

        if (!formData.password.trim()) {
            newErrors.password = "비밀번호를 입력해주세요.";
        } else if (formData.password.length < 4) {
            newErrors.password = "비밀번호는 최소 4자 이상이어야 합니다.";
        }

        if (!formData.title.trim()) {
            newErrors.title = "제목을 입력해주세요.";
        } else if (formData.title.length < 2) {
            newErrors.title = "제목은 최소 2자 이상이어야 합니다.";
        } else if (formData.title.length > 100) {
            newErrors.title = "제목은 100자 이하여야 합니다.";
        }

        if (!formData.sentence.trim()) {
            newErrors.sentence = "내용을 입력해주세요.";
        } else if (formData.sentence.length < 2) {
            newErrors.sentence = "내용은 최소 2자 이상이어야 합니다.";
        } else if (formData.sentence.length > 500) {
            newErrors.sentence = "내용은 500자 이하여야 합니다.";
        }

        if (!formData.cityName.trim()) {
            newErrors.cityName = "도시명을 입력해주세요.";
        }

        if (!formData.date) {
            newErrors.date = "날짜를 선택해주세요.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await apiFetch('/api/v1/comments', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            router.push('/comments');

        } catch (error: any) {
            alert(error.msg || '댓글 작성에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-[73px]">
            {/* 헤더 - 기존 CommentsHeader와 동일한 스타일 */}
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="p-4">
                    <div className="flex items-center relative">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                        >
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>

                        <Link href="/comments" className="absolute left-1/2 transform -translate-x-1/2 text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">
                            WearLog
                        </Link>

                        <div className="ml-auto">
                            <PenTool size={20} className="text-indigo-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="px-4 py-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    <div className="p-6 border-b border-gray-100">
                        <h1 className="text-2xl font-bold text-gray-900">새 댓글 작성</h1>
                        <p className="text-gray-600 mt-2">커뮤니티와 경험을 공유해보세요</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">

                        {/* 기본 정보 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    이메일 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="your.email@example.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    비밀번호 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="수정/삭제시 사용됩니다"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        {/* 제목 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                제목 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                    errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="댓글 제목을 입력하세요"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>

                        {/* 내용 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                내용 <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.sentence}
                                onChange={(e) => handleChange('sentence', e.target.value)}
                                rows={6}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                                    errors.sentence ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="댓글 내용을 자세히 입력해주세요..."
                            />
                            {errors.sentence && (
                                <p className="mt-1 text-sm text-red-600">{errors.sentence}</p>
                            )}
                        </div>

                        {/* 추가 정보 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    태그
                                </label>
                                <input
                                    type="text"
                                    value={formData.tagString}
                                    onChange={(e) => handleChange('tagString', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="#날씨 #여행 #옷차림"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    이미지 URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>

                        {/* 위치 및 날짜 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    국가 코드
                                </label>
                                <select
                                    value={formData.countryCode}
                                    onChange={(e) => handleChange('countryCode', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="KR">대한민국 (KR)</option>
                                    <option value="US">미국 (US)</option>
                                    <option value="JP">일본 (JP)</option>
                                    <option value="CN">중국 (CN)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    도시명 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.cityName}
                                    onChange={(e) => handleChange('cityName', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        errors.cityName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="서울"
                                />
                                {errors.cityName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.cityName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    날짜 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleChange('date', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
                                {errors.date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                                )}
                            </div>
                        </div>

                        {/* 버튼들 */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="order-2 sm:order-1 w-full sm:w-auto px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
                                disabled={isSubmitting}
                            >
                                취소
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="order-1 sm:order-2 sm:ml-auto w-full sm:w-auto px-8 py-3 text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        작성 중...
                                    </div>
                                ) : (
                                    '댓글 작성'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}