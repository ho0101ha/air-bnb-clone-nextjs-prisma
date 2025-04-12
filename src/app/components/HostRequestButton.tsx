"use client";

import { useState } from "react";
import axios from "axios";

export default function HostRequestButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRequest = async () => {
    setLoading(true);
    setMessage("");

    try {
      await axios.post("/api/host-request");
      setMessage("HOST 申請を送信しました！");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.error || "申請に失敗しました");
      } else {
        setMessage("予期しないエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleRequest}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "申請中..." : "HOST 申請"}
      </button>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
}
