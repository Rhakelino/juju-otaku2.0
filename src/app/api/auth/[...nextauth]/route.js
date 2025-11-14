import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github"; 
import GoogleProvider from "next-auth/providers/google"; 
import { PrismaAdapter } from "@auth/prisma-adapter"; 
import prisma from "@/app/libs/prisma"; 

const useDatabase = !!prisma;

export const authOptions = {
  adapter: useDatabase ? PrismaAdapter(prisma) : undefined,

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

  pages: {
    signIn: "/signin",
  },

  secret: process.env.NEXT_AUTH_SECRET,

  session: {
    strategy: useDatabase ? "database" : "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
