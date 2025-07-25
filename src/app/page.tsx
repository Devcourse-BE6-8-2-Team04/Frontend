"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {

    const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <h1 className="text-4xl font-bold text-blue-800">
        글자색 배경색 바뀌면 tailwind 적용된 겁니다
      </h1>


        <button
            onClick={() => router.push("/comments")}
            className="px-6 py-3 bg-blue-500 text-white rounded shadow"
        >
        코멘트 목록
        </button>
    </div>
  );
}
