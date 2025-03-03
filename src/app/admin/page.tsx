// /app/admin/page.tsx
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSessionUser } from "../utils/getSessionUser";
import AdminPageClient from "../components/AdminPageClient";
import Link from "next/link";

export default async function AdminPage() {
  const sessionUser = await getSessionUser();
  // 作成者のメールアドレス（例）
  // const appCreatorEmail = "springwa04@gmail.com";
  const appCreatorEmail = process.env.APPCREATOREMAIL;

  // ユーザーが存在しない、または、ADMIN でもなく、かつ作成者でもない場合はリダイレクト
  if (!sessionUser || (sessionUser.role !== "ADMIN" && sessionUser.email !== appCreatorEmail)) {
    return redirect("/");
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  const accommodations = await prisma.accommodation.findMany({
    select: { id: true, name: true, location: true, price: true },
  });
  const reservationsRaw = await prisma.reservation.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      startDate: true,
      endDate: true,
      accommodation: { select: { name: true } },
    },
  });

  // Date 型の値を ISO 文字列に変換
  const reservations = reservationsRaw.map((r) => ({
    ...r,
    startDate: r.startDate.toISOString(),
    endDate: r.endDate.toISOString(),
  }));
  const hostRequests = await prisma.hostRequest.findMany({
    select: { id: true, userId: true, user: { select: { name: true, email: true } }, status: true },
  });
  
  return (
    <>
      <AdminPageClient
      users={users}
      accommodations={accommodations}
      reservations={reservations}
      hostRequests={hostRequests} 
    />
    <Link href="/">戻る</Link>
    </>
  
    
  );
}
