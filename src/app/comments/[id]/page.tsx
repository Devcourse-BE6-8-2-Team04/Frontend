"use client";

import React, { useState, useEffect, use } from "react";
import type { components } from "@/lib/backend/apiV1/schema";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/backend/client";
import Link from "next/link";

type CommentDto = components["schemas"]["CommentDto"];

function useComment(id: number) {
  const [comment, setComment] = useState<CommentDto | null>(null);

  useEffect(() => {
    apiFetch(`/api/v1/comments/${id}`)
      .then(setComment)
      .catch((error) => {
        alert(`${error.resultCode} : ${error.msg}`);
      });
  }, []);

  const deleteComment = (onSuccess: () => void) => {
    apiFetch(`/api/v1/comments/${id}`, {
      method: "DELETE",
    })
      .then(onSuccess)
      .catch((error) => {
        alert(`${error.resultCode} : ${error.msg}`);
      });
  };

  return { id, comment, deleteComment };
}

function CommentInfo({ commentState }: { commentState: ReturnType<typeof useComment> }) {
  const router = useRouter();
  const { id, comment, deleteComment: _deleteComment } = commentState;

  if (comment == null) {
    return <div className="text-gray-500 text-center mt-10">로딩중...</div>;
  }

  const deleteComment = () => {
    if (!confirm(`${comment.id}번 글을 정말 삭제하시겠습니까?`)) return;
    _deleteComment(() => router.replace("/comments"));
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
      <div className="text-lg font-semibold text-gray-800">{comment.email}</div>
      
      <div className="text-sm text-gray-600">
        <span>🌍 지역: <span className="font-medium">{comment.weatherInfoDto.location}</span></span>
        <span className="ml-10">📆 날짜: <span className="font-medium">{comment.weatherInfoDto.date}</span></span>
      </div>
      
      <div className="whitespace-pre-line text-gray-700 border p-4 rounded-md bg-gray-50">
        {comment.sentence}
      </div>

      {comment.tagString && (
        <div className="flex flex-wrap gap-2">
            {comment.tagString
                .split("#")
                .filter((tag) => tag.trim() !== "")
                .map((tag, idx) => (
                    <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-300"
                    >
                    #{tag}
                    </span>
            ))}
        </div>
      )}


      {comment.imageUrl && (
        <div>
          <img
            src={comment.imageUrl}
            alt="댓글 이미지"
            className="max-w-full h-auto rounded-md border"
          />
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={deleteComment}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          삭제
        </button>
        <Link
          href={`/comments/edit/${id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          수정
        </Link>
      </div>
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = use(params);
  const id = parseInt(idStr);

  const commentState = useComment(id);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📝 코멘트 상세페이지</h1>
        </div>

        <CommentInfo commentState={commentState} />
      </div>
    </div>
  );
}
