import { PrismaClient } from "@prisma/client";
import { log } from "console";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma || new PrismaClient();

console.log(prisma);

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

