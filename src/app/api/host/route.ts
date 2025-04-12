import { getSessionUser } from "@/app/utils/getSessionUser";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const appCreatorEmail = process.env.APPCREATOREMAIL;

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "未認証のリクエスト" }, { status: 401 });
  }

  const isAdmin = user.email === appCreatorEmail;

  try {
    let accommodations;
    if (isAdmin) {
      accommodations = await prisma.accommodation.findMany({
        include: { property: true },
      });
    } else {
      const properties = await prisma.property.findMany({
        where: { ownerId: user.id },
        select: { accommodationId: true },
      });

      const accommodationIds = properties.map((p) => p.accommodationId).filter((id) => id !== null) as number[];

      accommodations = await prisma.accommodation.findMany({
        where: { id: { in: accommodationIds } },
        include: { property: true },
      });
    }

    const reservations = await prisma.reservation.findMany({
      where: isAdmin
        ? {}
        : {
            accommodationId: {
              in: accommodations.map((acc) => acc.id),
            },
          },
    });

    return NextResponse.json({ accommodations, reservations });
  } catch (error) {
    console.error("データ取得エラー:", error);
    return NextResponse.json({ error: "データ取得に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "未認証のリクエスト" }, { status: 401 });
  }

  try {
    const { id, type } = await req.json();
    if (!id || !type) {
      return NextResponse.json({ error: "IDまたはタイプが不足しています" }, { status: 400 });
    }

    const isAdmin = user.email === appCreatorEmail;

    if (type === "accommodation") {
      const accommodation = await prisma.accommodation.findUnique({
        where: { id },
        include: { property: true },
      });

      if (!accommodation) {
        return NextResponse.json({ error: "宿泊施設が見つかりません" }, { status: 404 });
      }

      if (!isAdmin && accommodation.property?.ownerId !== user.id) {
        return NextResponse.json({ error: "権限がありません" }, { status: 403 });
      }

      await prisma.accommodation.delete({ where: { id } });
      return NextResponse.json({ message: "宿泊施設を削除しました" });
    }

    if (type === "reservation") {
      const reservation = await prisma.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 });
      }

      const accommodation = await prisma.accommodation.findUnique({
        where: { id: reservation.accommodationId },
        include: { property: true },
      });

      if (!accommodation) {
        return NextResponse.json({ error: "関連する宿泊施設が見つかりません" }, { status: 404 });
      }

      if (!isAdmin && accommodation.property?.ownerId !== user.id) {
        return NextResponse.json({ error: "権限がありません" }, { status: 403 });
      }

      await prisma.reservation.delete({ where: { id } });
      return NextResponse.json({ message: "予約を削除しました" });
    }

    return NextResponse.json({ error: "無効なタイプ" }, { status: 400 });
  } catch (error) {
    console.error("削除エラー:", error);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "未認証のリクエスト" }, { status: 401 });
  }

  try {
    const requestData = await req.json();
    console.log("PUTリクエスト受信:", requestData); // リクエスト内容を確認

    const { accommodation, reservation } = requestData;

    if (accommodation) {
      console.log("更新対象の宿泊施設:", accommodation); // accommodation の中身を確認
      const existingAccommodation = await prisma.accommodation.findUnique({
        where: { id: accommodation.id },
        include: { property: true },
      });

      if (!existingAccommodation) {
        return NextResponse.json({ error: "宿泊施設が見つかりません" }, { status: 404 });
      }

      const isAdmin = user.email === process.env.APPCREATOREMAIL; // 環境変数の大文字修正

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

      console.log("宿泊施設更新完了:", updatedAccommodation); // 更新結果を確認
      return NextResponse.json(updatedAccommodation);
    }

    if (reservation) {
      console.log("更新対象の予約:", reservation); // reservation の中身を確認
      const existingReservation = await prisma.reservation.findUnique({
        where: { id: reservation.id },
      });

      if (!existingReservation) {
        return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 });
      }

      const accommodation = await prisma.accommodation.findUnique({
        where: { id: existingReservation.accommodationId },
        include: { property: true },
      });

      if (!accommodation) {
        return NextResponse.json({ error: "関連する宿泊施設が見つかりません" }, { status: 404 });
      }

      const isAdmin = user.email === process.env.APPCREATOREMAIL;

      if (!isAdmin && accommodation.property?.ownerId !== user.id) {
        return NextResponse.json({ error: "権限がありません" }, { status: 403 });
      }

      const updatedReservation = await prisma.reservation.update({
        where: { id: reservation.id },
        data: {
          people: reservation.people,
          startDate: new Date(reservation.startDate) ,
          endDate: new Date(reservation.endDate),
          name: reservation.name,
          email: reservation.email,
        },
      });

      console.log("予約更新完了:", updatedReservation); // 更新結果を確認
      return NextResponse.json(updatedReservation);
    }

    return NextResponse.json({ error: "無効なリクエスト" }, { status: 400 });
  } catch (error) {
    console.error("更新エラー:", error);
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}
