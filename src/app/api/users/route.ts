
import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/app/utils/getSessionUser";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 必須項目がすべて揃っているかチェック
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "名前、メールアドレス、パスワードは必須です。" },
        { status: 400 }
      );
    }

    // 既存のユーザーを確認
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています。" },
        { status: 400 }
      );
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザーを作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, 
        role:Role.USER,// Prismaスキーマのpasswordフィールドに保存
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "ユーザー登録中にエラーが発生しました。" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// **全ユーザー取得（GET）**

export async function GET() {
  const user =  await getSessionUser();
  if(!user || user.role  !==  Role.ADMIN){
    return NextResponse.json({error:"権限がありません"},{status:403});
  }
  const users = prisma.user.findMany({
    select:{id:true,name:true,email:true,role:true},
  });
  return NextResponse.json(users);
  
}

export async function DELETE(id:number) {
  const user =  await getSessionUser();
  if(!user || user.role  !==  Role.ADMIN){
    return NextResponse.json({error:"権限がありません"},{status:403});
  }
   prisma.user.delete({where:{id}});
   return NextResponse.json
}