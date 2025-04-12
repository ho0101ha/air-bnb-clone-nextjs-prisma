import { PrismaClient } from "@prisma/client"

import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const likeCount = await prisma.like.groupBy({
         by:["accommodationId"],
         _count:{accommodationId:true},
        });
        return NextResponse.json(likeCount,{status:200});
    } catch (error) {
        console.error("likeカウントエラー:", error);
        return NextResponse.json({ error: "エラーが発生しました" }, { status: 500 });
  }
    }
    