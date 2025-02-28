import { getSessionUser } from "@/app/utils/getSessionUser";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const appCreatorEmail = process.env.APPCREATOREMAIL || "";

export async function DELETE(req: NextRequest) {
    try {
        const user = await getSessionUser(); // セッションユーザーの取得

        if (!user || (user.role !== "ADMIN" && user.email !== appCreatorEmail)) {
            return NextResponse.json({ message: "権限がありません" }, { status: 403 });
        }

        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ message: "idがありません" }, { status: 400 });
        }

        await prisma.reservation.delete({ where: { id: parseInt(id, 10) } });

        return NextResponse.json({ message: "予約を削除しました" }, { status: 200 });
    } catch (error) {
        console.error("予約の削除エラー:", error);
        return NextResponse.json({ message: "予約の削除に失敗しました" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const user = await getSessionUser(); // セッションユーザーの取得

        if (!user || (user.role !== "ADMIN" && user.email !== appCreatorEmail)) {
            return NextResponse.json({ message: "権限がありません" }, { status: 403 });
        }

        const { id, startDate, endDate } = await req.json();
        if (!id || !startDate || !endDate) {
            return NextResponse.json({ message: "必要な情報が不足しています" }, { status: 400 });
        }

        // 予約 ID の存在を確認
        const reservation = await prisma.reservation.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!reservation) {
            return NextResponse.json({ message: "予約が見つかりません" }, { status: 404 });
        }

        // 日付を Date オブジェクトに変換
        const start = new Date(startDate);
        const end = new Date(endDate);

        // 日付の有効性を確認
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json({ message: "日付が無効です" }, { status: 400 });
        }

        if (start >= end) {
            return NextResponse.json({ message: "チェックイン日はチェックアウト日より前である必要があります" }, { status: 400 });
        }

        await prisma.reservation.update({
            where: { id: parseInt(id, 10) },
            data: { startDate: start, endDate: end },
        });

        return NextResponse.json({ message: "予約日を変更しました" }, { status: 200 });
    } catch (error) {
        console.error("予約の変更エラー:", error);
        return NextResponse.json({ message: "予約の変更に失敗しました" }, { status: 500 });
    }
}
