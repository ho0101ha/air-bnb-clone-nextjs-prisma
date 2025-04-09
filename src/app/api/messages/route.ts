import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: {
      userId: parseInt(session.user.id, 10),   
    },
    orderBy: { createdAt: "desc" },
  
  });

  return NextResponse.json({messages});
}

export async function POST(request:NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  try{
    const {content} = await request.json();
    const message = await prisma.message.create({
      data:{
        userId:parseInt(session.user.id,10),
        content,
      },
    });
    return NextResponse.json({message})
  }catch(error){
    console.error('Error sending message:',error);
  }

  return NextResponse.json({error:"Failed to send message"},{status:500});
}