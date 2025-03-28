
// import { NextRequest, NextResponse } from "next/server";

// import { PrismaClient } from "@prisma/client";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/route";
// const prisma = new PrismaClient()
// export async function POST(req: NextRequest) {
//   try {
//     const { userId, ownerId } = await req.json();

//     if (!userId || ownerId) {
//       return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
//     }

//     const existingFollow = await prisma.follower.findFirst({
//       where: { followerId: Number(userId), followingId: Number(ownerId) },
//     });

//     if (existingFollow) {
//       await prisma.follower.delete({
//         where: { id: existingFollow.id },
//       });
//       return NextResponse.json({ message: "Unfollowed" });
//     } else {
//       await prisma.follower.create({
//         data: { followerId: Number(userId), followingId: Number(ownerId) },
//       });
//       return NextResponse.json({ message: "Followed" });
//     }
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ownerId } = await req.json(); // リクエストボディから ownerId を取得

    if (!ownerId) {
      return NextResponse.json({ error: "Missing ownerId" }, { status: 400 });
    }

    // `session.user.email` から `User` の `id` を取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: user.id,  // `followerEmail` ではなく `followerId` を使用
        followingId: ownerId,
      },
    });

    if (existingFollow) {
      // 既にフォローしている場合は削除（アンフォロー）
      await prisma.follower.delete({
        where: {
          id: existingFollow.id,
        },
      });

      return NextResponse.json({ message: "Unfollowed" });
    } else {
      // フォローしていない場合は新規作成
      await prisma.follower.create({
        data: {
          followerId: user.id, // `followerEmail` ではなく `followerId` を使用
          followingId: ownerId,
        },
      });

      return NextResponse.json({ message: "Followed" });
    }
  } catch (error) {
    console.error("Error processing follow request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


