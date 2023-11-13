import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env.mjs";

const checkRequestAdminAuth = (request: NextRequest) => {
  const headers = request.headers;
  const adminKey = headers.get("Authorization");
  const hasCorrectAdminKey = adminKey === `Bearer ${env.ADMIN_KEY}`;

  return hasCorrectAdminKey;
};

export const middleware = (request: NextRequest) => {
  const hasCorrectAdminKey = checkRequestAdminAuth(request);

  if (!hasCorrectAdminKey) {
    return NextResponse.json(
      {
        success: false,
        message: "authentication failed",
      },
      {
        status: 401,
      },
    );
  }
};

export const config = {
  matcher: "/api/admin/:path*",
};
