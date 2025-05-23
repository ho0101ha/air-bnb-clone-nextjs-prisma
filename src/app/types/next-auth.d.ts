// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // ユーザーIDを追加
      email: string;
      name: string;
    };
  }

  interface User {
    id: string;
  }
}
