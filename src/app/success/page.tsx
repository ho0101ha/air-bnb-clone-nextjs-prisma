"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">支払いが完了しました！</h1>
      <p>予約が確定しました。ありがとうございました！</p>
      <p>ID:{sessionId}</p>
      <Link href="/" className="mt-4 text-blue-500">ホームに戻る</Link>
    </div>
  );
}
