// File: src/app/libs/prisma.js
import { PrismaClient } from "@prisma/client";
const USE_DATABASE = process.env.USE_DATABASE === 'true';

let client;

if (USE_DATABASE) {
  console.log("Database connection is ENABLED");
  client = globalThis.prisma || new PrismaClient();
  if (process.env.NODE_ENV !== "production") globalThis.prisma = client;
} else {
  console.log("Database connection is DISABLED");
  client = null;
  if (process.env.NODE_ENV !== "production") globalThis.prisma = null;
}

export default client;