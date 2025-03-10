// import { getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";
// import { authOptions } from "../auth/[...nextauth]/route";
// import { error } from "console";

// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
// export async function POST(req:NextRequest){
// const session = await getServerSession(authOptions);
// if(!session || !session.user?.email){
//     return NextResponse.json({error:"未登録ユーザーです"},{status:401});
// } 
// const {accommodataionId}= await req.json();
// if(!accommodataionId){
//     return NextResponse.json({error:"宿泊施設IDが必要です"},{status:403});
// }
// try {
// const user = await prisma.user.findMany({
//     where:{email:session.user.email}
// });
// if(!user){
//     return NextResponse.json({error:"ユーザーが見つかりません"},{status:404});
// }
// const existingLike = await prisma.like.findFirst({
//     where:{
//         userId:Number(session.user.id),
//         accommodationId:accommodataionId,
//     },
// });
// if(existingLike){
//     await prisma.like.delete({
//         where:{id:existingLike.id}
//     });
//     return NextResponse.json({message:"いいねが解除されました"},{status:200}); 
// }else{
//     await prisma.like.create({
//         data:{
//             userId:Number(session.user.id),
//             accommodationId:accommodataionId, 
//         }
//     });
//     return NextResponse.json({message:"いいねがおされました"},{status:201}); 
// }

// } catch (error) {
//     return NextResponse.json({ error: "エラーが発生しました" }, { status: 500 });
// }
// }
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
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}