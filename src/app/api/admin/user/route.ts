import { getSessionUser } from "@/app/utils/getSessionUser";
import { PrismaClient } from "@prisma/client";
import { error } from "console";
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
      const {id,role} = await req.json();
      if(!id || !role )return NextResponse.json({error:"idか権限がありません"});
      await prisma.user.delete({where:{id}});
      return NextResponse.json({messge:"ユーザーを削除しました"});
    } catch (error) {
        return NextResponse.json({error:"削除に失敗しました"},{status:500});
    }
}

export async function PATCH(req:NextRequest) {
    const user = await getSessionUser();
    const appCreatorEmail = process.env.APPCREATOREMAil;
    if(!user || (user?.role === "ADMIN" && user.email !== appCreatorEmail)){
        return NextResponse.json({error:"権限がありません"},{status:403});
    }
    try {
      const {id,role} = await req.json();
      if(!id || !role )return NextResponse.json({error:"idか権限がありません"});
      if(role !=="USER" && role !=="HOST" && role !=="ADMIN"){
        return NextResponse.json({error:"無効な役割です"},{status:400});
      }
      await prisma.user.update({
        where:{id},
      data:{role}});
      return NextResponse.json({messge:`ユーザーの権限を${role}にしました`});
    } catch (error) {
        return NextResponse.json({error:"削除に失敗しました"},{status:500});
    }
}