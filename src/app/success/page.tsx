"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  useEffect(() => {
    if (reservationId) {
      axios
        .patch(`/api/reservations/${reservationId}`, { paid: true }) 
        .then(() => console.log(" 予約データを更新しました"))
        .catch((error) => console.error(" 予約データ更新エラー:", error));
    }
  }, [reservationId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">支払いが完了しました！</h1>
      <p>予約が確定しました。ありがとうございました！</p>
      <Link href="/" className="mt-4 text-blue-500">ホームに戻る</Link>
    </div>
  );
}
