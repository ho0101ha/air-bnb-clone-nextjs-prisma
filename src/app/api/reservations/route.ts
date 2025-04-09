import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();
export async function GET(req: NextRequest) {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { accommodation: true }, // 宿泊施設の情報を含める
    });

    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
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
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  
  }
}


export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id, people, startDate, endDate } = await req.json();

  const reservation = await prisma.reservation.update({
    where: { id },
    data: { people, startDate, endDate },
  });

  return NextResponse.json(reservation);
}