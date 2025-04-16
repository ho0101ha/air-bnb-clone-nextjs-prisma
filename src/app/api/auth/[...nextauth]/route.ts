// ✅ src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // ✅ 他のファイルからimport推奨

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // ✅ ルートとして認識されるのはこれだけ
