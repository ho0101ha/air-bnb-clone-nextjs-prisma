import { getSessionUser } from "@/app/utils/getSessionUser";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function DELETE(req:NextRequest) {
    const user = await getSessionUser();
    // const appCreatorEmail = "springwa04@gmail.com";
    const appCreatorEmail = process.env.APPCREATOREMAil;
    if(!user || (user?.role === "ADMIN" && user.email !== appCreatorEmail)){
        return NextResponse.json({error:"権限がありません"},{status:403});
    }
    try {
      const {id} = await req.json();
      if(!id  )return NextResponse.json({error:"idか権限がありません"});
      await prisma.accommodation.delete({where:{id}});
      return NextResponse.json({messge:"宿泊先を削除しました"});
    } catch (error) {
        return NextResponse.json({error:"削除に失敗しました"},{status:500});
    }
}
