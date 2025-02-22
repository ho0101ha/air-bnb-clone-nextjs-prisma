import { getSessionUser } from "@/app/utils/getSessionUser";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function DELETE(req:NextRequest) {
    const user = await getSessionUser();
    const appCreatorEmail = process.env.APPCREATOREMAil;
    if(!user || (user?.role === "ADMIN" && user.email !== appCreatorEmail)){
        return NextResponse.json({error:"権限がありません"},{status:403});
    }
    try {
      const {id} = await req.json();
      if(!id )return NextResponse.json({error:"idがありません"});
      await prisma.reservation.delete({where:{id}});
      return NextResponse.json({messge:"予約を削除しました"});
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
      const {id,startDate,endDate} = await req.json();
      if(!id )return NextResponse.json({error:"idがありません"});
      await prisma.reservation.update({
        where:{id},
      data:{startDate,endDate}});
      return NextResponse.json({messge:"予約日を変更しました"});
    } catch (error) {
        return NextResponse.json({error:"削除に失敗しました"},{status:500});
    }
}