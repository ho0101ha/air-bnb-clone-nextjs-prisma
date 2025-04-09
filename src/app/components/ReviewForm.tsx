"use client";

import axios from "axios";
import React, { useState } from "react";

export default function ReviewForm({ accommodationId }: { accommodationId: number }) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // クライアント側でも簡単なバリデーション
    if (!content || rating < 1 || rating > 5) {
      alert("レビュー内容とレートを正しく入力してください");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/reviews", { content, rating, accommodationId });
      alert("レビューを投稿しました");
      setContent("");
      setRating(5);
    } catch (error: any) {
      console.error("レビュー投稿エラー:", error.response?.data || error.message);
      alert("レビューの投稿に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>
            レビュー内容
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="ここにレビューを入力してください..."
              rows={4}
            />
          </label>
        </div>
        <div className="mb-4">
          <label>
            レート (1~5)
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mb-4 bg-red-500 text-white p-2 rounded-md hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "投稿中..." : "投稿する"}
        </button>
      </form>
    </div>
  );
}
