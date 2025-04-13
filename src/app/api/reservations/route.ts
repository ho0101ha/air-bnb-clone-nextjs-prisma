import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { accommodation: true }, // 宿泊施設の情報を含める
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('reservations接続失敗エラー:', error);
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {

  try {
    
    const { accommodationId, name, people, email, startDate, endDate } = await request.json();

    if (!accommodationId || !name || !people || !email || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const reservation = await prisma.reservation.create({
      data: {
        accommodationId: Number(accommodationId),
        name,
        people: Number(people),
        email,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        paid: false,  // 
      },
    });
    console.log("予約データ保存成功:",reservation.id);
    return NextResponse.json(reservation);
  } catch (error) {
    console.error('reservation失敗エラー:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  
  }
}


// export async function PUT(req: Request) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//   }

//   const { id, people, startDate, endDate } = await req.json();

//   const reservation = await prisma.reservation.update({
//     where: { id },
//     data: { people, startDate, endDate },
//   });

//   return NextResponse.json(reservation);
  
// }

export async function PUT(req: NextRequest) {
  try {
    const { id, people, startDate, endDate } = await req.json();

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { people, startDate: new Date(startDate), endDate: new Date(endDate) },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("PUTエラー:", error);
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 });
  }
}