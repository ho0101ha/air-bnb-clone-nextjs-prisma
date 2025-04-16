import { Suspense } from "react";
import SuccessClient from "./SuccessClient";
import Link from "next/link";


export default function SuccessPage() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">支払い完了！</h1>
      <Suspense fallback={<p>読み込み中...</p>}>
        <SuccessClient />
      </Suspense>
      <Link href={"/"} className="mt-5 text-center">トップへ戻る</Link>
    </main>
  );
}
