import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const followerCounts = await prisma.follower.groupBy({
      by: ["ownerId"],
      _count: { ownerId: true },
    });

    return NextResponse.json(followerCounts, { status: 200 });
  } catch (error) {
    console.error("フォロワー数取得エラー:", error);
    return NextResponse.json({ error: "エラーが発生しました" }, { status: 500 });
  }
}
