"use client";

import React from "react";
import Link from "next/link";
import { PenTool } from "lucide-react";

interface HeaderProps {
  onCreateClick: () => void;
}

export function Header({ onCreateClick }: HeaderProps) {
  return (
    <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="p-4">
          <div className="flex relative items-center">
            <Link href="/comments" className="absolute left-1/2 transform -translate-x-1/2 text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">
              WearLog
            </Link>
            <div className="ml-auto">
              <button
                onClick={onCreateClick}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition-all transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
              >
                <PenTool size={18} />
                <span className="hidden sm:inline">글 쓰기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}