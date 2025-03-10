import React from "react";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import Reservation from "@/app/components/Reservation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ReviewForm from "@/app/components/ReviewForm";
import { getSessionUser } from "@/app/utils/getSessionUser";
// type SessionUser ={
//   name:string;
//   id:number;
//   emmail:string
// }
const prisma = new PrismaClient();

export default async function AccommodationPage({
  params,
}: {
  params: { id: string

   };
}) {
  const sessionUser = await getSessionUser();
  const session = await getServerSession(authOptions);
  const user = sessionUser ? { name: sessionUser.name, email: sessionUser.email } : null;
  // サーバーセッションを取得
 

  // 宿泊施設情報を取得
  const accommodation = await prisma.accommodation.findUnique({
    where: { id: parseInt(params.id, 10) },
    include: {
      reservations: true,
      reviews: { include: { user: true } }, // レビューとユーザー情報を取得
    },
  });

  if (!accommodation) {
    return <div className="text-center">宿泊施設が見つかりませんでした。</div>;
  }

  return (
    <main className="p-8 w-full mx-auto ">
      <h1 className="text-2xl font-bold mb-4 text-center">{accommodation.name}</h1>
      <div className="w-1/2 mx-auto border border-gray-300 px-5">
        <img
          src={accommodation.imageUrl}
          alt={accommodation.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p>{accommodation.description}</p>
        <p className="text-sm text-gray-600 mb-4">{accommodation.locationJP}</p>
        <p className="text-lg font-bold mb-8">¥{accommodation.price}/泊</p>

        {/* レビューを表示 */}
        <h2>レビュー</h2>
        {accommodation.reviews.map((review) => (
          <div key={review.id} className="mb-4">
            <p>{review.content}</p>
            <p>評価: {review.rating}</p>
            <p>投稿者: {review.user.name}</p>
          </div>
        ))}

        {/* 予約コンポーネント */}
        <Reservation accommodation={accommodation} user={user}/>

        {/* レビュー投稿フォーム */}
        {session?.user && (
          <ReviewForm accommodationId={accommodation.id} />
        )}

        <Link href={"/"} className="block mb-4 hover:underline">トップへ戻る</Link>
      </div>
    </main>
  );
}
