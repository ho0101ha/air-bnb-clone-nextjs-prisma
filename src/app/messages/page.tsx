import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
const prisma = new PrismaClient();
export default async function Messages() {
   
   const session = await getServerSession(authOptions);

  if (!session || !session.user)  {
    return <div>ログインが必要です。</div>;
  }
   const messages = await prisma.message.findMany({
    where:{ userId:parseInt(session.user.id,10)},
    orderBy:{createdAt:"desc"},
   });
  return (
    <div className="container mx-auto p-4">
        <h1>メッセージ一覧</h1>
        { messages.length ===0 ?<p>メッセージがありません</p>:
        (<div>
            <ul>
            {messages.map((message) =>
            <li key={message.id}>{message.content}<span>{new Date(message.createdAt).toLocaleString()}</span>
            </li>)}
            
            </ul>
            
        </div>)}
        <Link href={"/"}>トップへ戻る</Link>
     
    </div>
  );
}
