import { PrismaClient } from '@prisma/client';
// import Link from 'next/link';
import AccommodationList from './components/AccommodationList';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import UserMenue from './components/UserMenue';
// import { signIn, signOut } from 'next-auth/react';
import LoginLogoutButton from './components/LoginLogoutButton';

const prisma = new PrismaClient();


export default async function AccommodationPage() {
  const accommodations = await prisma.accommodation.findMany();

  // お気に入りデータを取得し、宿泊施設IDのリストとして整形
// IDのみの配列に変換

  const session = await getServerSession(authOptions);
  const favorites = session
  ? await prisma.favorite.findMany({
      where: {
        userId: parseInt(session.user.id, 10),
      },
      select: { accommodationId: true },
    })
  : [];

const favoriteIds = favorites.map((fav) => fav.accommodationId);
  return (
    <div className="container mx-auto p-4">
      <header className="py-4 flex justify-between">
        <div>logo</div>
        <div>
         <LoginLogoutButton isLoggedIn={!!session}/>
        </div>
      </header>
      <main>
      <h1 className="text-2xl font-bold text-center mb-2">Airbnb Clone</h1>
      <p className='text-center text-xl mb-3'>魅力的な思い出になる旅</p>
        <div>
          <AccommodationList
            accommodations={accommodations}
            initialFavorites={favoriteIds} // 初期お気に入りデータを渡す
          />
          {session?.user && <UserMenue /> }
        </div>
      </main>
    </div>
  );
}