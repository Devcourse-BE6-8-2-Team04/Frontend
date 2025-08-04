"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Modal from "../modals/Modal";
import { Header } from "./CommentsHeader";
import { SearchFilters } from "./SearchFilters";
import { ActiveFilters } from "./ActiveFilters";
import { ResultsCount } from "./ResultsCount";
import { CommentsList } from "./CommentsList";
import { Pagination } from "./Pagination";
import { LoadingSpinner } from "./LoadingSpinner";
import type { components } from "@/lib/backend/apiV1/schema";
import { apiFetch } from "@/lib/backend/client";
import { SearchFiltersType } from "../types";

type CommentDto = components["schemas"]["CommentDto"];

export default function CommentsMain() {
  const router = useRouter();
  const [comments, setComments] = useState<CommentDto[] | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [filters, setFilters] = useState<SearchFiltersType>({});

  const fetchComments = async (currentPage: number, searchFilters: SearchFiltersType) => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      size: '10'
    });
       
    if (searchFilters.location) params.append('location', searchFilters.location);
    if (searchFilters.feelsLikeTemperature !== undefined) params.append('feelsLikeTemperature', searchFilters.feelsLikeTemperature.toString());
    if (searchFilters.month !== undefined) params.append('month', searchFilters.month.toString());

    apiFetch(`/api/v1/comments?${params}`).then((res) => {
      setComments(res.content || []);
      setTotalPages(res.totalPages ?? 0);
      setTotalElements(res.totalElements);
    }).catch((error) => {
      console.error(`${error.resultCode} : ${error.msg}`);
    });
  };

  useEffect(() => {
    fetchComments(page, filters);
  }, [page, filters]);

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    setPage(0); // 필터 변경 시 첫 페이지로 이동
  };

  const handleCreate = (comment: CommentDto) => {
    setComments([comment, ...(comments || [])]);
    setShowModal(false);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  if (comments === null) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-[73px]">
      <Header onCreateClick={() => router.push('/comments/create')} />

      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <SearchFilters onFiltersChange={handleFiltersChange} />
          <ActiveFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </div>

        <ResultsCount totalElements={totalElements} hasActiveFilters={hasActiveFilters} />

        <CommentsList
          comments={comments}
          totalElements={totalElements}
          page={page}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}