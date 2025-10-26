// File: src/libs/prismadb.js
import { PrismaClient } from "@prisma/client";

// Mencegah multiple instance Prisma Client di development
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;