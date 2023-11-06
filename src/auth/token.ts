import { type EmailVerificationClaim } from "@prisma/client";
import { type PassableDBClient, db as standardDb } from "~/server/db";
import { generateRandomString, isWithinExpiration } from "lucia/utils";
import { addMilliseconds } from "date-fns";

export const TOKEN_LIFE_SPAN_MS = 1000 * 60 * 60 * 2; // 2 hours

const ONE_HOUR_MS = 1000 * 60 * 60;

const TOKEN_LENGTH = 63;

const generateNewToken = () => generateRandomString(TOKEN_LENGTH);

/**
 * We consider a verification token to be valid if it has
 * at least 1 hour left before it expires.
 */
const emailVerificationTokenIsValid = (
  token: EmailVerificationClaim,
): boolean => isWithinExpiration(token.expires.getTime() - ONE_HOUR_MS);

export const getEmailVerificationTokenForUserWithId = async (
  userId: string,
  db: PassableDBClient = standardDb,
): Promise<string> => {
  const existingVerificationClaims = await db.emailVerificationClaim.findMany({
    where: {
      user_id: userId,
    },
  });

  const reusableClaim = existingVerificationClaims.find(
    emailVerificationTokenIsValid,
  );

  if (reusableClaim) return reusableClaim.token;

  const newToken = generateNewToken();
  const tokenLifespanFromNow = addMilliseconds(new Date(), TOKEN_LIFE_SPAN_MS);

  await db.emailVerificationClaim.create({
    data: {
      token: newToken,
      user_id: userId,
      expires: tokenLifespanFromNow,
    },
  });

  return newToken;
};

export const consumeEmailVerificationTokenAndReturnUserId = async (
  token: string,
  db: PassableDBClient = standardDb,
): Promise<string> => {
  // Check that the token does in fact exist in
  // the database
  const fullClaim = await db.emailVerificationClaim.findUnique({
    where: {
      token,
    },
  });

  if (!fullClaim) throw new Error("Invalid token");

  // Delete the token from the database so it can't be
  // used again
  await db.emailVerificationClaim.deleteMany({
    where: {
      user_id: fullClaim.user_id,
    },
  });

  const tokenExpiresAtMs = fullClaim.expires.getTime();
  const tokenHasExpired = !isWithinExpiration(tokenExpiresAtMs);
  if (tokenHasExpired) throw new Error("Expired token");

  return fullClaim.user_id;
};
