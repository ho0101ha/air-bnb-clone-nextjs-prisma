// ✅ 修正済み page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSessionUser } from "@/app/utils/getSessionUser";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Reservation from "@/app/components/Reservation";
import ReviewForm from "@/app/components/ReviewForm";
import LikeButton from "@/app/components/LikeButton";
import SessionWrapper from "@/app/components/SessionWrapper";
import Image from "next/image";

export default async function Page({ params }: { params: { id: string } }) {
  const sessionUser = await getSessionUser();
  const session = await getServerSession(authOptions);

  const user = sessionUser
    ? { name: sessionUser.name, email: sessionUser.email }
    : null;

  const accommodation = await prisma.accommodation.findUnique({
    where: { id: Number(params.id) },
    include: {
      reservations: true,
      reviews: { include: { user: true } },
    },
  });

  if (!accommodation) {
    return <div className="text-center">宿泊施設が見つかりませんでした。</div>;
  }

  const likesCountMap: Record<number, number> = {};
  let likedAccommodations: number[] = [];

  if (session?.user?.email) {
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { like: true },
    });
    likedAccommodations = currentUser?.like.map((like) => like.accommodationId) || [];
  }

  const likeCount = await prisma.like.groupBy({
    by: ["accommodationId"],
    _count: { accommodationId: true },
  });

  likeCount.forEach((item) => {
    likesCountMap[item.accommodationId] = item._count.accommodationId;
  });

  return (
    <main className="p-8 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">{accommodation.name}</h1>
      <div className="w-full md:w-1/2 mx-auto border border-gray-300 px-5 rounded-lg">
        {accommodation.imageUrl && (
          <div className="relative w-full h-64 mb-4">
            <Image
              src={accommodation.imageUrl}
              alt={accommodation.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        )}
        <p>{accommodation.description}</p>
        <p className="text-sm text-gray-600 mb-4">{accommodation.locationJP}</p>
        <p className="text-lg font-bold mb-8">¥{accommodation.price}/泊</p>

        <SessionWrapper>
          <h2 className="text-xl font-semibold mt-6 mb-2">レビュー</h2>
          {accommodation.reviews.length > 0 ? (
            accommodation.reviews.map((review) => (
              <div key={review.id} className="mb-4 border-b pb-2">
                <p>{review.content}</p>
                <p>評価: {review.rating}</p>
                <p>投稿者: {review.user.name}</p>
                <LikeButton
                  accommodationId={accommodation.id}
                  isLiked={likedAccommodations.includes(accommodation.id)}
                  initialCount={likesCountMap[accommodation.id] || 0}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">まだレビューがありません。</p>
          )}

          <Reservation accommodation={accommodation} user={user} />
          {session?.user && <ReviewForm accommodationId={accommodation.id} />}
        </SessionWrapper>

        <Link href="/" className="block mb-4 hover:underline mt-6 text-blue-600 text-center">
          トップへ戻る
        </Link>
      </div>
    </main>
  );
}
