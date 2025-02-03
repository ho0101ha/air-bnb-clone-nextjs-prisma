// import bcrypt from "bcrypt";
// import { PrismaClient } from "@prisma/client";
// import { NextResponse } from "next/server";
// const prisma = new PrismaClient();

// export async function POST(request: Request) {
//   try {
//     const { name, email, password } = await request.json();

//     if (!name || !email || !password) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password:hashedPassword,
// // 修正：コロンで正しく接続
//       },
//     });

//     return NextResponse.json(user);
//   } catch (error) {
//     console.error('Error creating user:', error);
//     return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }


import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

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
        password: hashedPassword, // Prismaスキーマのpasswordフィールドに保存
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error creating user:", error.message);
    return NextResponse.json(
      { error: "ユーザー登録中にエラーが発生しました。" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
