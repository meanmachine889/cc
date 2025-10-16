import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // For production, use a shared Prisma client instance

export async function GET() {
  try {
    const count = await prisma.waitlist.count();

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Failed to fetch waitlist count:", error);
    return NextResponse.json(
      { error: "Could not retrieve waitlist count." },
      { status: 500 }
    );
  }
}