import { prisma } from '@/lib/prisma';
import AccommodationList from './components/AccommodationList';
import { getServerSession } from 'next-auth';
import UserMenue from './components/UserMenue';
import LoginLogoutButton from './components/LoginLogoutButton';
import HostRequestButton from './components/HostRequestButton';
import { getSessionUser } from './utils/getSessionUser';
import SessionWrapper from './components/SessionWrapper';
import { authOptions } from '@/lib/auth';

export default async function Page() {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let accommodations: any[] = [];
  try {
    accommodations = await prisma.accommodation.findMany({
      include: {
        property: {
          include: {
            owner: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching accommodations:", error);
  }

  const session = await getServerSession(authOptions);
  const sessionUser = await getSessionUser();

  let likedAccommodations: number[] = [];
  const likesCountMap: Record<number, number> = {};
  let initialFollowedUsers: number[] = [];
  const followersCountMap: Record<number, number> = [];
  let favoriteIds: number[] = [];

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { like: true },
    });
    likedAccommodations = user?.like.map((like) => like.accommodationId) || [];
  }

  const likeCount = await prisma.like.groupBy({
    by: ['accommodationId'],
    _count: { accommodationId: true },
  });

  likeCount.forEach((item) => {
    likesCountMap[item.accommodationId] = item._count.accommodationId;
  });

  if (session?.user?.id) {
    const userId = Number(session.user.id);

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { accommodationId: true },
    });
    favoriteIds = favorites.map((fav) => fav.accommodationId);

    try {
      const followedUsers = await prisma.follower.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      initialFollowedUsers = followedUsers.map((f) => f.followingId);

      const followersData = await prisma.follower.groupBy({
        by: ['followingId'],
        _count: { followingId: true },
      });

      followersData.forEach((item) => {
        followersCountMap[item.followingId] = item._count.followingId;
      });
    } catch (error) {
      console.error('フォロー取得エラー:', error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <header className="py-4 flex justify-between">
        <div>logo</div>
        <div>
          <div className="mb-3">
            <SessionWrapper>
              <LoginLogoutButton isLoggedIn={!!session} />
            </SessionWrapper>
          </div>
          <div>
            {sessionUser?.role === 'USER' && (
              <SessionWrapper>
                <HostRequestButton />
              </SessionWrapper>
            )}
          </div>
        </div>
      </header>
      <main>
        <h1 className="text-2xl font-bold text-center mb-2">Airbnb Clone</h1>
        <p className="text-center text-xl mb-3">魅力的な思い出になる旅</p>
        <div>
          <SessionWrapper>
            <AccommodationList
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
              accommodations={accommodations.map((a: any) => ({
                ...a,
                ownerId: a.property?.owner?.id ?? 0,
              }))}
              initialFavorites={favoriteIds}
              likedAccommodations={likedAccommodations}
              likesCountMap={likesCountMap}
              initialFollowedUsers={initialFollowedUsers}
              followersCountMap={followersCountMap}
            />
            {session?.user && <UserMenue />}
          </SessionWrapper>
        </div>
      </main>
    </div>
  );
}
