import { NextResponse } from "next/server";
import { db } from "~/server/db";

export const DELETE = async () => {
  const now = new Date();
  const result = await db.emailVerificationClaim.deleteMany({
    where: {
      expires: {
        gte: now,
      },
    },
  });

  console.log(`Deleted ${result.count} expired email claims`);

  return NextResponse.json({
    deletedClaims: result.count,
  });
};

export const GET = DELETE; // Required for vercel cron jobs
