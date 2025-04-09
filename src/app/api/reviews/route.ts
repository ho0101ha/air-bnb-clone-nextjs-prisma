import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const body = await req.json();
    const { content, rating, accommodationId } = body;

    if (
      typeof content !== "string" ||
      typeof rating !== "number" ||
      typeof accommodationId !== "number"
    ) {
      return NextResponse.json(
        { error: "すべての項目を正しく入力してください" },
        { status: 400 }
      );
    }

    // 宿泊施設とオーナーを取得
    const accommodation = await prisma.accommodation.findUnique({
      where: { id: accommodationId },
      include: {
        property: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!accommodation?.property?.owner) {
      return NextResponse.json(
        { error: "宿泊施設のオーナーが見つかりません" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        content,
        rating,
        accommodationId,
        userId: parseInt(session.user.id),
        ownerId: accommodation.property.owner.id,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "レビューの保存に失敗しました" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
