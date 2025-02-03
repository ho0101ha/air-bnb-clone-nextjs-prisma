import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function UserPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user)  {
    return <div>ログインが必要です。</div>;
  }

  return (
    <div className="container mx-auto p-4 h-full ">
      
      <h1 className="text-2xl font-bold mb-4 text-center mt-20">ユーザー情報</h1>
      <div className="border border-gray-200 w-1/3 flex mx-auto justify-center-center flex-col mb-5">
      <p className="text-center mb-5">お名前: {session.user.name}</p>
      <p className="text-center mb-3">メールアドレス: {session.user.email}</p>
      </div>
      <Link href={"/"} className='block text-center hover:underline'>トップへ戻る</Link>
    </div>
  );
}
