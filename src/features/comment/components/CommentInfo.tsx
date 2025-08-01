import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useComment } from "../hooks/useComment";
import { LoadingSpinner } from "./LoadingSpinner";
import { CommentHeader } from "./CommentHeader";
import { CommentCard } from "./CommentCard";
import PasswordModal from "./PasswordModal";

interface CommentInfoProps {
  commentState: ReturnType<typeof useComment>;
}

export function CommentInfo({ commentState }: CommentInfoProps) {
  const router = useRouter();
  const { comment, deleteComment, verifyPassword } = commentState;
  const [showPwModal, setShowPwModal] = useState<"delete" | "edit" | null>(null);

  if (comment == null) {
    return <LoadingSpinner />;
  }

  const executeDelete = () => {
    if (!confirm(`${comment.id}번 글을 정말 삭제하시겠습니까?`)) return;
    deleteComment(() => router.back());
  };

  const handlePasswordVerify = async (pw: string) => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-[73px]">
      <CommentHeader
        onEdit={() => setShowPwModal("edit")}
        onDelete={() => setShowPwModal("delete")}
      />

      <div className="px-4 py-6 max-w-4xl mx-auto">
        <CommentCard comment={comment} />
      </div>

      {showPwModal && (
        <PasswordModal
          onClose={() => setShowPwModal(null)}
          onVerify={handlePasswordVerify}
        />
      )}
    </div>
  );
}