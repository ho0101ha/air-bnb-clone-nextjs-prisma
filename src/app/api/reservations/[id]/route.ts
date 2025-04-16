import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// ✅ 共通でID取得するユーティリティ（使いまわし可能）
function extractIdFromUrl(req: NextRequest): number | null {
  const segments = req.nextUrl.pathname.split("/");
  const id = segments[segments.length - 1];
  const numericId = Number(id);
  return isNaN(numericId) ? null : numericId;
}

// ✅ DELETEメソッド
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reservationId = extractIdFromUrl(req);
  if (!reservationId) {
    return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
  }

  try {
    await prisma.reservation.delete({
      where: { id: reservationId },
    });

    return NextResponse.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json({ error: "Failed to delete reservation" }, { status: 500 });
  }
}

// ✅ PATCHメソッド
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const reservationId = extractIdFromUrl(req);
  if (!reservationId) {
    return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
  }

  try {
    const { startDate, endDate, people, paid } = await req.json();

    const updateData: {
      startDate?: Date;
      endDate?: Date;
      people?: number;
      paid?: boolean;
    } = {};

    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (people) updateData.people = Number(people);
    if (paid !== undefined) updateData.paid = paid;

    const updated = await prisma.reservation.update({
      where: { id: reservationId },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 });
  }
}



// import { getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";

// import prisma from "@/lib/prisma";

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     console.log(`Received DELETE request for reservation ID: ${params.id}`);

//     if (!params.id) {
//       return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
//     }

//     const reservationId = Number(params.id);
//     if (isNaN(reservationId)) {
//       console.error(`Invalid reservation ID: ${params.id}`);
//       return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
//     }

//     console.log(`Deleting reservation: ${reservationId}`);

//     await prisma.reservation.delete({
//       where: { id: reservationId },
//     });

//     console.log(`Successfully deleted reservation ID: ${reservationId}`);

//     return NextResponse.json({ message: "Reservation deleted successfully" });
//     }catch (error) {
//             console.error("Error deleting reservation:", error);
//             return NextResponse.json({ error: "Failed to delete reservation" }, { status: 500 });
//           }

    
// }


// export async function PATCH(request:NextRequest,{params}:{params:{id:string}}) {
//   const session = await getServerSession(authOptions);

//     if (!session?.user) {
//       return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
//     }
//     try{
//       const { startDate, endDate, people,paid } = await request.json();
//       const updateData: { startDate?: Date; endDate?: Date; people?: number; paid?: boolean } = {};
//       if (startDate) updateData.startDate = new Date(startDate);
//     if (endDate) updateData.endDate = new Date(endDate);
//     if (people) updateData.people = Number(people);
//     if (paid !== undefined) updateData.paid = paid;
//       const updatedReservation = await prisma.reservation.update({
//         where: { id: Number(params.id) },
//             data:updateData,
//       //   data: {
//       //     startDate: new Date(startDate),
//       //     endDate: new Date(endDate),
//       //     people: Number(people),
//       //   },
//       });
//      return NextResponse.json(updatedReservation);
//     }catch (error) {
//         console.error("Error update reservation:", error);
//         return NextResponse.json({ error: "Failed to delete reservation" }, { status: 500 });
//       };


// }

