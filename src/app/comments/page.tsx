"use client";

import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import type { components } from "@/lib/backend/apiV1/schema";
import { apiFetch } from "@/lib/backend/client";
import Link from "next/link";

type CommentDto = components["schemas"]["CommentDto"];

export default function Page() {
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        apiFetch(`/api/v1/comments?page=${page}&size=10`).then((res) => {
            setComments(res.content || []);
            setTotalPages(res.totalPages ?? 0);  // Page 객체의 필드
            setTotalElements(res.totalElements);
        });
    }, [page]);

    // 코멘트 등록
    const handleCreate = (comment: CommentDto) => {
        setComments([comment, ...comments]);
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-blue-50 p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black">코멘트 목록</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-500 text-black rounded cursor-pointer"
                >
                    코멘트 작성
                </button>
            </div>

            {/* 코멘트 목록 */}
            {comments.length == 0 && <div>글이 없습니다.</div>}
            {comments.length > 0 && (
                <table className="min-w-full table-auto border-separate border-spacing-y-2">
                    <thead>
                        <tr className="bg-blue-100 text-gray-800 text-left text-sm uppercase tracking-wider">
                            <th className="px-4 py-3 text-center">번호</th>
                            <th className="px-4 py-3">내용</th>
                            <th className="px-4 py-3">작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.map((comment, index) => (
                            <tr
                                key={comment.id}
                                className="bg-white hover:bg-blue-50 transition-shadow shadow-sm rounded-md"
                            >
                                <td className="px-4 py-3 text-center font-mono text-sm text-gray-600">
                                    {totalElements - (page * 10 + index)}
                                </td>
                                <td className="px-4 py-3">
                                    <Link
                                        href="#"
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        {comment.sentence}
                                    </Link>
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