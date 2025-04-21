import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    console.warn("セッションにメールアドレスが存在しません。");
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      console.warn("該当ユーザーが見つかりませんでした。");
      return null;
    }

    return user;
  } catch (error) {
    console.error("getSessionUser エラー:", error);
    return null;
  }
}
