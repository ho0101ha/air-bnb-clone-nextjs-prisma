import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.reservation.deleteMany();  // 予約データを削除
  await prisma.favorite.deleteMany();     // お気に入りデータを削除
  await prisma.review.deleteMany();       // レビューデータを削除
  await prisma.accommodation.deleteMany();
  await prisma.accommodation.createMany({
    data: [
      {
        name: '東京の中心地アパート',
        description: '東京駅近くの便利なロケーションのモダンなアパート。',
        price: 12000,
        location: 'Tokyo',
        locationJP: '東京',
        imageUrl: '/images/tokyo-hotel.jpg',
      },
      {
        name: '京都の伝統的な町家',
        description: '歴史を感じる静かなエリアにある快適な町家。',
        price: 15000,
        location: 'Kyoto',
        locationJP: '京都',
        imageUrl: '/images/kyoto-ryokan.jpg',
      },
      {
        name: '大阪のモダンなフラット',
        description: '人気のエリアにあるモダンなフラット。',
        price: 10000,
        location: 'Osaka',
        locationJP: '大阪',
        imageUrl: '/images/osaka-flat.jpg',
      },
      {
        name: '沖縄のプライベートビーチのあるコテージ',
        description: '綺麗なプライベートビーチ。',
        price: 10000,
        location: 'Okinawa',
        locationJP: '沖縄',
        imageUrl: '/images/okinawa-sea.jpg',
      },
      {
        name: '北海道の雪景色が美しい宿',
        description: '幻想的な非日常的な雪景色',
        price: 10000,
        location: 'Hokkaido',
        locationJP: '北海道',
        imageUrl: '/images/hokkaido-cotage.jpg',
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
