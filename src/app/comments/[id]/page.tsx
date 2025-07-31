"use client";

import React, { useState, useEffect, use } from "react";
import type { components } from "@/lib/backend/apiV1/schema";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/backend/client";
import Link from "next/link";
import PasswordModal from "./PasswordModal";
import { ChevronLeft, MapPin, Thermometer, Calendar, Edit, Trash2, Tag } from "lucide-react";

type CommentDto = components["schemas"]["CommentDto"];

function useComment(id: number) {
  const [comment, setComment] = useState<CommentDto | null>(null);

  useEffect(() => {
    apiFetch(`/api/v1/comments/${id}`)
      .then(setComment)
      .catch((error) => {
        alert(`${error.resultCode} : ${error.msg}`);
      });
  }, [id]);

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
  const { id, comment, deleteComment } = commentState;
  const [showPwModal, setShowPwModal] = useState<"delete" | "edit" | null>(null);

  if (comment == null) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  const verifyPassword = async (password: string) => {
    return apiFetch(`/api/v1/comments/${id}/verify-password`, {
      method: "POST",
      body: JSON.stringify({ password }),
    }).then((res) => res.data === true)
    .catch((error) => {
      alert(error.msg);
      return false;
    });
  };

  const executeDelete = () => {
    if (!confirm(`${comment.id}번 글을 정말 삭제하시겠습니까?`)) return;
    deleteComment(() => router.back());
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <Link href="/comments" className="text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WearLog
              </Link>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPwModal("edit")}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <Edit size={18} />
                <span className="hidden sm:inline text-sm font-medium">수정</span>
              </button>
              <button
                onClick={() => setShowPwModal("delete")}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 size={18} />
                <span className="hidden sm:inline text-sm font-medium">삭제</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Title Section */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-keep leading-tight">
              {comment.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="truncate">{comment.email}</span>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(comment.weatherInfoDto.date).toLocaleDateString("ko-KR", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Weather Info */}
          <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Thermometer size={16} />
              날씨 정보
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {comment.weatherInfoDto.location && (
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{comment.weatherInfoDto.location}</span>
                </div>
              )}
              {comment.weatherInfoDto.feelsLikeTemperature && (
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl">
                  <Thermometer size={16} className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">{comment.weatherInfoDto.feelsLikeTemperature}°C</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl">
                <Calendar size={16} className="text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  {new Date(comment.weatherInfoDto.date).toLocaleDateString("ko-KR", { month: 'long' })}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed text-sm sm:text-base">
              {comment.sentence}
            </div>
          </div>

          {/* Tags */}
          {comment.tagString && (
            <div className="px-4 sm:px-6 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">태그</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {comment.tagString
                  .split("#")
                  .filter((tag) => tag.trim() !== "")
                  .map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Image */}
          {comment.imageUrl && (
            <div className="px-4 sm:px-6 pb-6">
              <div className="relative w-full overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={comment.imageUrl}
                  alt="댓글 이미지"
                  className="w-full h-auto object-contain max-h-200"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {showPwModal && (
        <PasswordModal
          onClose={() => setShowPwModal(null)}
          onVerify={async (pw) => {
            if (showPwModal === "delete") {
              const isValid = await verifyPassword(pw);
              if (isValid) {
                setShowPwModal(null);
                setTimeout(() => executeDelete(), 10);
             }
            } else {
              const isValid = await verifyPassword(pw);
              if (isValid) {
                setShowPwModal(null);
                // router.push(`/comments/edit/${id}`);
              }
            }
          }}
        />
      )}
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = use(params);
  const id = parseInt(idStr);

  const commentState = useComment(id);

  return <CommentInfo commentState={commentState} />;
}