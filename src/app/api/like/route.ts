
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { accommodationId } = await req.json();
    const userId = parseInt(session.user.id, 10);

    if (!accommodationId) {
      return NextResponse.json({ error: "Accommodation ID is required" }, { status: 400 });
    }

    const existingLike = await prisma.like.findFirst({
      where: { userId, accommodationId },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.like.create({
        data: { userId, accommodationId },
      });
    }

    return NextResponse.json({ message: "Like updated" });
  } catch (error) {
    console.error("いいね変更エラー:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}