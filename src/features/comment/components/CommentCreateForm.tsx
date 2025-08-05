"use client";

import React, { useState } from "react";
import { MapPin, Thermometer, CalendarDays, Plus } from "lucide-react";

export function CommentCreateForm() {
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [feelsLikeTemperature, setFeelsLikeTemperature] = useState("");
    const [month, setMonth] = useState("");
    const [date, setDate] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // 이미지 업로드 핸들러 (미리보기)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImageUrl(reader.result as string);
            reader.readAsDataURL(file);
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

    // 서버 전송은 프로젝트 로직에 맞게 구현
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: 등록 로직 (API 연동)
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-3xl mx-auto mt-10 p-8">
            {/* 제목 */}
            <input
                type="text"
                placeholder="제목을 입력하세요"
                className="w-full font-semibold text-xl md:text-2xl border-b border-gray-200 mb-3 py-2 focus:outline-none"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />

            {/* 이메일 및 날짜 */}
            <div className="flex items-center justify-between mb-2">
                <input
                    type="email"
                    placeholder="이메일"
                    className="text-sm text-gray-600 font-mono py-1 focus:outline-none bg-gray-50 px-2 rounded"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="date"
                    className="text-sm text-gray-500 py-1 px-2 rounded bg-gray-50 focus:outline-none"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                />
            </div>

            {/* 날씨 정보 */}
            <div className="flex gap-2 mb-4">
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                    <MapPin size={16} />
                    <input
                        type="text"
                        placeholder="위치"
                        className="bg-gray-50 focus:outline-none text-xs"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="flex items-center gap-1 text-blue-600 bg-gray-50 px-2 py-1 rounded-md">
                    <Thermometer size={16} />
                    <input
                        type="number"
                        placeholder="체감온도(°C)"
                        className="bg-gray-50 focus:outline-none text-xs w-14"
                        value={feelsLikeTemperature}
                        onChange={e => setFeelsLikeTemperature(e.target.value)}
                        required
                    />
                </div>
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                    <CalendarDays size={16} />
                    <input
                        type="number"
                        min={1}
                        max={12}
                        placeholder="월"
                        className="bg-gray-50 focus:outline-none text-xs w-10"
                        value={month}
                        onChange={e => setMonth(e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* 내용 */}
            <textarea
                placeholder="내용을 입력하세요"
                className="w-full min-h-[80px] border-b border-gray-200 mb-4 py-2 focus:outline-none"
                value={content}
                onChange={e => setContent(e.target.value)}
                required
            />

            {/* 태그 */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">태그</span>
                    <input
                        type="text"
                        placeholder="#태그 입력 후 Enter"
                        className="bg-gray-50 focus:outline-none px-2 py-1 text-xs rounded"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" ? (e.preventDefault(), handleTagAdd()) : undefined}
                    />
                    <button type="button" onClick={handleTagAdd} className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                        <Plus size={14} />
                    </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-900 px-2 py-1 rounded text-xs cursor-pointer"
                              onClick={() => handleTagRemove(tag)}>
              #{tag}
            </span>
                    ))}
                </div>
            </div>

            {/* 이미지 업로드/미리보기 */}
            <div className="mb-6">
                <label className="block text-xs text-gray-500 mb-1">이미지</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs mb-2"
                />
                {imageUrl && (
                    <div className="w-full rounded-xl overflow-hidden bg-gray-100">
                        <img src={imageUrl} alt="미리보기" className="w-full h-auto object-contain" />
                    </div>
                )}
            </div>

            {/* 제출 */}
            <button
                type="submit"
                className="w-full py-2 mt-3 bg-blue-900 text-white rounded-xl font-semibold shadow hover:bg-blue-800 transition"
            >
                등록
            </button>
        </form>
    );
}