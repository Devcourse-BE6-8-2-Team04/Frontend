"use client";
import React, { useState } from "react";
import Modal from "./Modal";

export default function Page() {
    const [comments, setComments] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);

    // 코멘트 등록
    const handleCreate = (comment: string) => {
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
            <ul className="space-y-4">
                {comments.map((comment, idx) => (
                    <li key={idx} className="bg-white p-4 rounded shadow text-black">{comment}</li>
                ))}
            </ul>
            {showModal && (
                <Modal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreate}
                />
            )}
        </div>
    );
}