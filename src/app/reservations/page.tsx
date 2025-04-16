import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth';
import React from 'react'

import Link from 'next/link';
import ClientReservations from '../components/ClientReservations';
import { authOptions } from '@/lib/auth';
const prisma = new PrismaClient();

export  default async function ReservationsPage() {
    const session = await getServerSession(authOptions);
    if(!session?.user){
        return<div>
            <p className='text-center'>ログインして下さい</p>
            </div>
            }
    const reservations = await prisma.reservation.findMany({
      where: { email: session.user.email }, 
      include: { accommodation: true },
      orderBy: { startDate: "desc" },
    });
    const formattedReservations = reservations.map((reservation) => ({
      ...reservation,
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      paid:reservation.paid,
    }));

  return (
    <div>
      <h1 className='text-center my-5 text-xl'>予約リスト</h1>
  
        <ClientReservations reservations={formattedReservations} />
        <Link href={"/"} className='block text-center hover:underline'>トップへ戻る</Link>
    </div>
  )
}
