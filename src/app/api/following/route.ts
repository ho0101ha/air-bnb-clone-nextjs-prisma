import { getSessionUser } from "@/app/utils/getSessionUser";
import { PrismaClient } from "@prisma/client";
import {  NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET() {
    const user = await getSessionUser();
    if(!user){
        return NextResponse.json({error:"ログインして下さい"},{status:401});;
    }
    const userId = Number(user.id);
    try {
        const followimg = await prisma.follower.findMany({
            where:{followerId:userId},
            select:{followingId:true},
        });
        return NextResponse.json(followimg);
    } catch (error) {
        console.error("フォロー変更失敗:", error); 
        return NextResponse.json({ error: "Failed to fetch following list" }, { status: 500 });
    }
}