import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: parseInt(session.user.id, 10),
    },
    select: {
      accommodationId: true,
    },
  });

  return NextResponse.json({
    favorites: favorites.map((fav) => fav.accommodationId),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const { accommodationId } = await req.json();

  if (!accommodationId) {
    return NextResponse.json({ error: "宿泊施設IDが必要です。" }, { status: 400 });
  }

  const userId = parseInt(session.user.id, 10);

  // お気に入りの状態を確認
  const existingFavorite = await prisma.favorite.findFirst({
    where: { userId, accommodationId },
  });

  if (existingFavorite) {
    // 既にお気に入りの場合は解除
    await prisma.favorite.delete({
      where: { id: existingFavorite.id },
    });
    return NextResponse.json({ success: true, removed: true });
  } else {
    // お気に入りに追加
    const newFavorite = await prisma.favorite.create({
      data: { userId, accommodationId },
    });
    return NextResponse.json({ success: true, added: true, favorite: newFavorite });
  }
}
