import { PrismaClient } from '@prisma/client';
import {  NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const accommodations = await prisma.accommodation.findMany();
    
    // return new Response(JSON.stringify(accommodations), { status: 200 });
    return NextResponse.json(accommodations);
  } catch (error) {
    return NextResponse.json('accommodation接続に失敗', { status: 500 });
  }
}
