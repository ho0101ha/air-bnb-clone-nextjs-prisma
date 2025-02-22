import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 依存データを削除（順番を調整）
  await prisma.message.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.accommodation.deleteMany(); // Accommodationを先に削除
  await prisma.property.deleteMany(); // Propertyをその後に削除
  await prisma.user.deleteMany(); // 最後にUserを削除
 
  // 環境変数のバリデーション
  const appCreatorEmail = process.env.APPCREATOREMAil; // 環境変数名を修正
  const appCreatePassword = process.env.APPCREATPASSWORD;

  if (!appCreatorEmail || !appCreatePassword) {
    throw new Error("APPCREATOREMAIL または APPCREATPASSWORD が設定されていません");
  }

  // アプリ管理者 (オーナー + ADMIN) の作成
  const hashedAdminPassword = await bcrypt.hash(appCreatePassword, 10);
  const adminUser = await prisma.user.create({
    data: {
      name: "アプリ管理者",
      email: appCreatorEmail,
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });

  // 宿泊施設オーナーの作成
  const hostUser = await prisma.user.create({
    data: {
      name: "宿泊施設オーナーA",
      email: "ownerA@example.com",
      password: await bcrypt.hash("ownerpassword", 10),
      role: "HOST",
    },
  });

  // 宿泊施設を作成（id を取得）
  const tokyo = await prisma.accommodation.create({
    data: {
      name: "東京の中心地アパート",
      description: "東京駅近くの便利なロケーションのモダンなアパート。",
      price: 12000,
      location: "Tokyo",
      locationJP: "東京",
      imageUrl: "/images/tokyo-hotel.jpg",
    },
  });

  const kyoto = await prisma.accommodation.create({
    data: {
      name: "京都の伝統的な町家",
      description: "歴史を感じる静かなエリアにある快適な町家。",
      price: 15000,
      location: "Kyoto",
      locationJP: "京都",
      imageUrl: "/images/kyoto-ryokan.jpg",
    },
  });

  const osaka = await prisma.accommodation.create({
    data: {
      name: "大阪のモダンなフラット",
      description: "人気のエリアにあるモダンなフラット。",
      price: 10000,
      location: "Osaka",
      locationJP: "大阪",
      imageUrl: "/images/osaka-flat.jpg",
    },
  });

  const okinawa = await prisma.accommodation.create({
    data: {
      name: "沖縄のプライベートビーチのあるコテージ",
      description: "綺麗なプライベートビーチ。",
      price: 10000,
      location: "Okinawa",
      locationJP: "沖縄",
      imageUrl: "/images/okinawa-sea.jpg",
    },
  });

  const hokkaido = await prisma.accommodation.create({
    data: {
      name: "北海道の雪景色が美しい宿",
      description: "幻想的な非日常的な雪景色",
      price: 10000,
      location: "Hokkaido",
      locationJP: "北海道",
      imageUrl: "/images/hokkaido-cotage.jpg",
    },
  });

  // 宿泊施設の所有者 (Property) を作成
  await prisma.property.createMany({
    data: [
      {
        name: "東京の中心地アパート",
        location: "Tokyo",
        ownerId: adminUser.id, // アプリ管理者が所有
        accommodationId: tokyo.id,
      },
      {
        name: "京都の伝統的な町家",
        location: "Kyoto",
        ownerId: adminUser.id, // アプリ管理者が所有
        accommodationId: kyoto.id,
      },
      {
        name: "大阪のモダンなフラット",
        location: "Osaka",
        ownerId: hostUser.id, // 宿泊施設オーナーAが所有
        accommodationId: osaka.id,
      },
    ],
  });

  console.log("データのシードが完了しました！");
}

main()
  .catch((e) => {
    console.error("エラーが発生しました:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
