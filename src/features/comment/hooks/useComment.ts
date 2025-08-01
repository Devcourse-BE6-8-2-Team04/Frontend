import { useState, useEffect } from "react";
import type { components } from "@/lib/backend/apiV1/schema";
import { apiFetch } from "@/lib/backend/client";

type CommentDto = components["schemas"]["CommentDto"];

export function useComment(id: number) {
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

  return { id, comment, deleteComment, verifyPassword };
}