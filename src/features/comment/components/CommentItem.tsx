"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Thermometer } from "lucide-react";
import type { components } from "@/lib/backend/apiV1/schema";

type CommentDto = components["schemas"]["CommentDto"];

interface CommentItemProps {
  comment: CommentDto;
  index: number;
  totalElements: number;
  page: number;
}

export function CommentItem({ comment, index, totalElements, page }: CommentItemProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] overflow-hidden">
      <Link href={`/comments/${comment.id}`}>
        <div className="p-4 flex gap-4">
          {/* 왼쪽 콘텐츠 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs md:text-sm font-mono text-gray-600 py-1">
                #{totalElements - (page * 10 + index)}
              </span>
              <h4 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                {comment.title}
              </h4>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="truncate">{comment.email}</span>
              <span>•</span>
              <span className="text-xs shrink-0">
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

          {/* 오른쪽 이미지 */}
          {comment.imageUrl && (
            <div className="flex-shrink-0">
              <img 
                src={comment.imageUrl} 
                alt="Comment image"
                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}