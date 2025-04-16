import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";
const prisma = new PrismaClient();
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const reservations= await prisma.reservation.findMany({
      where:{email:session.user.email},
      include:{accommodation:true},
      orderBy:{startDate:"desc"},
    })

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "予約リスト表示に失敗しました" }, { status: 500 }
    );
  } 
}
