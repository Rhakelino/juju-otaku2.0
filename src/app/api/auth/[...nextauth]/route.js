import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github"; // Ubah nama import
import GoogleProvider from "next-auth/providers/google"; // Ubah nama import
import { PrismaAdapter } from "@auth/prisma-adapter"; // <-- IMPORT ADAPTER
import prisma from "@/app/libs/prisma"; // <-- IMPORT PRISMA CLIENT

export const authOptions = {
  // 1. TAMBAHKAN ADAPTER
  adapter: PrismaAdapter(prisma),

  // 2. KONFIGURASI PROVIDER ANDA (sudah benar)
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // Halaman signin kustom Anda (sudah benar)
  pages: {
    signIn: "/signin",
  },

  // Rahasia (sudah benar)
  secret: process.env.NEXT_AUTH_SECRET,

  // 3. UBAH STRATEGI SESI
  session: {
    strategy: "database", // <-- UBAH DARI "jwt" (default) ke "database"
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },

  // 4. (Opsional) Aktifkan mode debug saat development
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };