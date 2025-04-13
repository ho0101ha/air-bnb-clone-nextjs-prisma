// route.ts (API Routes)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/app/utils/getSessionUser";

export async function POST() { 
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "ログインして下さい" }, { status: 401 });
    }

    const existingRequest = await prisma.hostRequest.findUnique({
      where: { userId: Number(user.id) },
    });

    if (existingRequest) {
      return NextResponse.json({ error: "申請済みです" }, { status: 400 });
    }

    const request = await prisma.hostRequest.create({
      data: { userId: Number(user.id) },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (err) {
    console.error("POST エラー:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, userId, approved } = await req.json();
    const sessionUser = await getSessionUser();

    const appCreatorEmail = process.env.APPCREATOREMAIL;
    if (
      !sessionUser ||
      (sessionUser.role !== "ADMIN" && sessionUser.email !== appCreatorEmail)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.hostRequest.update({
      where: { id },
      data: { status: approved ? "APPROVED" : "REJECTED" },
    });

    if (approved) {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "HOST" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH エラー:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
