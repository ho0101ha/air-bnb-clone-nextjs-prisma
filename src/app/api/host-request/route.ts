// route.ts (API Routes)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/app/utils/getSessionUser";
import { error } from "console";

export async function POST(req: Request) {
  const user = await getSessionUser();
  // const appCreatorEmail = process.env.APPCREATOREMAIL;
  if (!user ) {
    return NextResponse.json({ error: "ログインして下さい" }, { status: 401 });
  }

  const existingRequest = await prisma.hostRequest.findUnique(
    { where: { userId: Number(user.id) } });
  if (existingRequest) {
    return NextResponse.json({ error: "申請済みです" }, { status: 400 });
  }
  const request = await prisma.hostRequest.create({ data: { userId:Number(user.id) } });
  return NextResponse.json(request, { status: 201 });
}

// export async function GET() {
//   const user = await getSessionUser();
//   const appCreatorEmail = process.env.APPCREATOREMAIL;

//   console.log("環境変数 APPCREATOREMAIL:", appCreatorEmail); // 追加

//   if (!user || (user.role !== "ADMIN" && user.email !== appCreatorEmail)) {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }

//   const requests = await prisma.hostRequest.findMany({
//     include: { user: true },
//   });

//   return NextResponse.json(requests);
// }


// export async function PUT(req: Request) {
//   const user = await getSessionUser();
//   const appCreatorEmail = process.env.APPCREATOREMAIL;
//   if (!user || (user.role !== "ADMIN" && user.email !== appCreatorEmail)) {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }
//   const { requestId, status } = await req.json();
//   if (!["approved", "rejected"].includes(status)) {
//     return NextResponse.json({ error: "Invalid status" }, { status: 400 });
//   }
//   const request = await prisma.hostRequest.update({ where: { id: requestId }, data: { status } });
//   if (status === "approved") {
//     await prisma.user.update({ where: { id: request.userId }, data: { role: "HOST" } });
//   }
//   return NextResponse.json(request);
// }


export async function PATCH(req: Request) {
  const { id, userId, approved } = await req.json();
  const sessionUser = await getSessionUser();

  // 管理者チェック
    const appCreatorEmail = process.env.APPCREATOREMAIL;
  if (!sessionUser || (sessionUser.role !== "ADMIN" && sessionUser.email !== appCreatorEmail)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // 申請ステータスを更新
  await prisma.hostRequest.update({
    where: { id },
    data: { status: approved ? "APPROVED" : "REJECTED" },
  });

  // 承認の場合、ユーザーを HOST に変更
  if (approved) {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "HOST" },
    });
  }

  return NextResponse.json({ success: true });
}
