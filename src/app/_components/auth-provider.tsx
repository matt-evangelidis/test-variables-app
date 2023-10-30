"use client";

import { SessionProvider, type SessionProviderProps } from "next-auth/react";
import { type FC } from "react";

export const AuthProvider: FC<SessionProviderProps> = (props) => (
  <SessionProvider {...props} />
);
