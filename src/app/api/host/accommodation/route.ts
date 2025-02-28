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
        const accommodations = isAdmin
            ? await prisma.accommodation.findMany({ include: { property: true } })
            : await prisma.accommodation.findMany({
                  where: { property: { ownerId: user.id } },
                  include: { property: true },
              });

        return NextResponse.json(accommodations);
    } catch (error) {
        console.error("宿泊施設取得エラー:", error);
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
        const accommodation = await prisma.accommodation.findUnique({
            where: { id },
            include: { property: true },
        });

        if (!accommodation) return NextResponse.json({ error: "宿泊施設が見つかりません" }, { status: 404 });
        if (!isAdmin && accommodation.property?.ownerId !== user.id) {
            return NextResponse.json({ error: "権限がありません" }, { status: 403 });
        }

        await prisma.accommodation.delete({ where: { id } });
        return NextResponse.json({ message: "宿泊施設を削除しました" });
    } catch (error) {
        console.error("削除エラー:", error);
        return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "未認証のリクエスト" }, { status: 401 });

    try {
        const { accommodation } = await req.json();
        if (!accommodation) return NextResponse.json({ error: "更新データが不足しています" }, { status: 400 });

        const isAdmin = user.email === appCreatorEmail;
        const existingAccommodation = await prisma.accommodation.findUnique({
            where: { id: accommodation.id },
            include: { property: true },
        });

        if (!existingAccommodation) return NextResponse.json({ error: "宿泊施設が見つかりません" }, { status: 404 });
        if (!isAdmin && existingAccommodation.property?.ownerId !== user.id) {
            return NextResponse.json({ error: "権限がありません" }, { status: 403 });
        }

        const updatedAccommodation = await prisma.accommodation.update({
            where: { id: accommodation.id },
            data: {
                name: accommodation.name,
                description: accommodation.description,
                locationJP: accommodation.locationJP,
                imageUrl: accommodation.imageUrl,
                price: accommodation.price,
            },
        });

        return NextResponse.json(updatedAccommodation);
    } catch (error) {
        console.error("更新エラー:", error);
        return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
    }
}
