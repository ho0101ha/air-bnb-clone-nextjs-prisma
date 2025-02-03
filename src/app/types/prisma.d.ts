import { Prisma } from "@prisma/client";

declare module "@prisma/client" {
  interface User {
    password: string; // パスワードを型定義に追加
  }
}
