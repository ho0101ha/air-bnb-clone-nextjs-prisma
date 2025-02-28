import { getSessionUser } from "@/app/utils/getSessionUser";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const appCreatorEmail = process.env.APPCREATOREMAIL;

export async function GET(req: NextRequest) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "未認証のリクエスト" }, { status: 401 });

    const isAdmin = user.email === appCreatorEmail;

    try {
        const reservations = isAdmin
            ? await prisma.reservation.findMany()
            : await prisma.reservation.findMany({
                  where: { accommodation: { property: { ownerId: user.id } } },
              });

        return NextResponse.json(reservations);
    } catch (error) {
        console.error("予約取得エラー:", error);
        return NextResponse.json({ error: "データ取得に失敗しました" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "未認証のリクエスト" }, { status: 401 });

    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "IDが不足しています" }, { status: 400 });

        const isAdmin = user.email === appCreatorEmail;
        const reservation = await prisma.reservation.findUnique({
            where: { id },
        });

        if (!reservation) return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 });

        const accommodation = await prisma.accommodation.findUnique({
            where: { id: reservation.accommodationId },
            include: { property: true },
        });

        if (!accommodation) return NextResponse.json({ error: "関連する宿泊施設が見つかりません" }, { status: 404 });
        if (!isAdmin && accommodation.property?.ownerId !== user.id) {
            return NextResponse.json({ error: "権限がありません" }, { status: 403 });
        }

        await prisma.reservation.delete({ where: { id } });
        return NextResponse.json({ message: "予約を削除しました" });
    } catch (error) {
        console.error("削除エラー:", error);
        return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "未認証のリクエスト" }, { status: 401 });

    try {
        const { reservation } = await req.json();
        if (!reservation) return NextResponse.json({ error: "更新データが不足しています" }, { status: 400 });

        const isAdmin = user.email === appCreatorEmail;
        const existingReservation = await prisma.reservation.findUnique({
            where: { id: reservation.id },
        });

        if (!existingReservation) return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 });

        const updatedReservation = await prisma.reservation.update({
            where: { id: reservation.id },
            data: {
                people: reservation.people,
                startDate: new Date(reservation.startDate),
                endDate: new Date(reservation.endDate),
                name: reservation.name,
                email: reservation.email,
            },
        });

        return NextResponse.json(updatedReservation);
    } catch (error) {
        console.error("更新エラー:", error);
        return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
    }
}
