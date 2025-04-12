import Link from "next/link";

export default function CancelPage() {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">支払いがキャンセルされました</h1>
        <p>もう一度試してください。</p>
        <Link href="/" className="mt-4 text-blue-500">ホームに戻る</Link>
      </div>
    );
  }
  