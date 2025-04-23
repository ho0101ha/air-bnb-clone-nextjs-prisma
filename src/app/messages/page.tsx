import React from "react";
import { getServerSession } from "next-auth";

import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
const prisma = new PrismaClient();
export default async function Messages() {
   
   const session = await getServerSession(authOptions);

  if (!session || !session.user)  {
    return <div className="text-center mt-10">ログインが必要です。</div>;
  }
   const messages = await prisma.message.findMany({
    where:{ userId:parseInt(session.user.id,10)},
    orderBy:{createdAt:"desc"},
   });
  return (
    <div className="container mx-auto p-4">
        <h1 className="text-center text-xl mt-10">メッセージ一覧</h1>
        { messages.length ===0 ?<p className="text-center mt-5">メッセージがありません</p>:
        (<div>
            <ul>
            {messages.map((message) =>
            <li key={message.id}>{message.content}<span>{new Date(message.createdAt).toLocaleString()}</span>
            </li>)}
            
            </ul>
            
        </div>)}
        <Link href={"/"} className="mt-5 block text-center hover:underline">トップへ戻る</Link>
     
    </div>
  );
}
