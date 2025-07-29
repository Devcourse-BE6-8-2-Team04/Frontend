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

    useEffect(() => {
        apiFetch(`/api/v1/comments`).then((res) => setComments(res.content));
    }, []);

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
                    className="px-4 py-2 bg-blue-500 text-black rounded"
                >
                    코멘트 작성
                </button>
            </div>

            {/* 코멘트 목록 */}
            {comments.length == 0 && <div>글이 없습니다.</div>}
            {comments.length > 0 && (
                <ul className="space-y-4">
                    {comments.map((comment) => (
                        <li key={comment.id} className="bg-white p-4 rounded shadow text-black">
                            <Link href="#">{comment.sentence}</Link>
                        </li>
                    ))}
                </ul>
            )}

            {showModal && (
                <Modal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreate}
                />
            )}
        </div>
    );
}