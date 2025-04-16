import { getSessionUser } from "@/app/utils/getSessionUser";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// ✅ パスからIDを抽出（共通処理）
function extractId(req: NextRequest): number | null {
  const segments = req.nextUrl.pathname.split("/");
  const id = segments.pop(); // 最後の部分
  const userId = Number(id);
  return isNaN(userId) ? null : userId;
}

export async function DELETE(req: NextRequest) {
  const sessionUser = await getSessionUser();

  if (!sessionUser || sessionUser.role !== Role.ADMIN) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  const userId = extractId(req);
  if (!userId) {
    return NextResponse.json({ error: "不正なIDです" }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ message: "ユーザー削除成功" });
  } catch (error) {
    console.error("ユーザー削除エラー:", error);
    return NextResponse.json({ error: "削除失敗" }, { status: 500 });
  }
}
