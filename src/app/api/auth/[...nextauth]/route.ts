import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import LineProvider from "next-auth/providers/line";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // クレデンシャル認証
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスとパスワードを入力してください。");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
          },
        });

        if (!user) {
          throw new Error("ユーザーが存在しません。");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("パスワードが正しくありません。");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),

    // 他のプロバイダー（Google、Facebook、GitHub、LINE、Twitterなど）
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID!,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    // }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // }),
    // LineProvider({
    //   clientId: process.env.LINE_CLIENT_ID!,
    //   clientSecret: process.env.LINE_CLIENT_SECRET!,
    // }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_CLIENT_ID!,
    //   clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    // ログイン後にリダイレクト先を設定
    async redirect({ url, baseUrl }) {
      // ログイン後にトップページにリダイレクト
      if (url === "/") {
        return baseUrl;
      }
      return url;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import LineProvider from "next-auth/providers/line";
// import FacebookProvider from "next-auth/providers/facebook";
// import GitHubProvider from "next-auth/providers/github";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import prisma from "@/lib/prisma";
// import bcrypt from "bcrypt";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),

//     // LINEログイン
//     LineProvider({
//       clientId: process.env.LINE_CLIENT_ID as string,
//       clientSecret: process.env.LINE_CLIENT_SECRET as string,
//     }),

//     // Facebookログイン
//     FacebookProvider({
//       clientId: process.env.FACEBOOK_CLIENT_ID as string,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
//     }),

//     // GitHubログイン
//     GitHubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID as string,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
//     }),

//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         // id:{label: "Id", type: "text"},
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("メールアドレスとパスワードを入力してください。");
//         }

//         // `select`で必要なフィールドを明示的に指定
//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//           select: {
//             id: true,
//             email: true,
//             name: true,
//             password: true,
//           },
//         });

//         if (!user) {
//           throw new Error("ユーザーが存在しません。");
//         }

//         const isValidPassword = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isValidPassword) {
//           throw new Error("パスワードが正しくありません。");
//         }

//         return {
//           id: user.id.toString(),
//           email: user.email,
//           name: user.name,
//         };
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token?.id) {
//         session.user.id = token.id as string;
//       }
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };






// // import NextAuth, { NextAuthOptions } from "next-auth";


// // import CredentialsProvider from "next-auth/providers/credentials";
// // import GoogleProvider from "next-auth/providers/google";
// // import LineProvider from "next-auth/providers/line";
// // import FacebookProvider from "next-auth/providers/facebook";
// // import GitHubProvider from "next-auth/providers/github";
// // import { PrismaAdapter } from "@next-auth/prisma-adapter";

// // import bcrypt from "bcrypt";
// // import { prisma } from "@/lib/prisma";


// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import FacebookProvider from "next-auth/providers/facebook";
// import GitHubProvider from "next-auth/providers/github";
// import TwitterProvider from "next-auth/providers/twitter";
// import LineProvider from "next-auth/providers/line";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import prisma from "@/lib/prisma";
// import bcrypt from "bcrypt";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("メールアドレスとパスワードを入力してください。");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user || !user.password) {
//           throw new Error("ユーザーが存在しません。");
//         }

//         const isValidPassword = await bcrypt.compare(credentials.password, user.password);

//         if (!isValidPassword) {
//           throw new Error("パスワードが正しくありません。");
//         }

//         return {
//           id: user.id.toString(),
//           email: user.email,
//           name: user.name,
//         };
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     FacebookProvider({
//       clientId: process.env.FACEBOOK_CLIENT_ID as string,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
//     }),
//     GitHubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID as string,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
//     }),
//     TwitterProvider({
//       clientId: process.env.TWITTER_CLIENT_ID as string,
//       clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
//       version: "2.0",
//     }),
//     LineProvider({
//       clientId: process.env.LINE_CLIENT_ID as string,
//       clientSecret: process.env.LINE_CLIENT_SECRET as string,
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET as string,
//   callbacks: {
//     async signIn({ account, profile }) {
//       if (!account || !profile) return false;

//       if (account.provider === "credentials") {
//         return true;
//       }

//       let email = profile.email || `${profile.sub}@${account.provider}.com`;
//       const name = profile.name ?? "ユーザー";

//       try {
//         let user = await prisma.user.findUnique({ where: { email } });

//         if (!user) {
//           user = await prisma.user.create({
//             data: {
//               name,
//               email,
//               password: "",
//             },
//           });
//         }

//         return true;
//       } catch (error) {
//         console.error("OAuthログイン時のエラー:", error);
//         return false;
//       }
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token?.id) {
//         session.user.id = token.id as string;
//       }
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
