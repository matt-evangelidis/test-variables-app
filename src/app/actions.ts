"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/auth/lucia";
import { consumeEmailVerificationTokenAndReturnUserId } from "~/auth/token";
import { db } from "~/server/db";

export const consumeVerificationToken = async (token: string) => {
  const userId = await consumeEmailVerificationTokenAndReturnUserId(token);

  const user = await db.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  await auth.invalidateAllUserSessions(user.id);

  if (!user.email_verified) {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        email_verified: true,
      },
    });
  }

  const session = await auth.createSession({
    userId: user.id,
    attributes: {},
  });
  const sessionCookie = auth.createSessionCookie(session);

  cookies().set(sessionCookie.name, sessionCookie.value);

  redirect("/");
};

export const invalidateAuthSessionsForUserWithId = async (userId: string) => {
  await auth.invalidateAllUserSessions(userId);
};
