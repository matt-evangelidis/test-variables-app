"use client";

import { type WithChildren } from "$react-types";
import { type Session } from "lucia";
import { type FC, createContext, useContext } from "react";

const NO_SESSION_PROVIDER = Symbol("NO_SESSION_PROVIDER");
type NoSessionProviderSymbol = typeof NO_SESSION_PROVIDER;

const SessionContext = createContext<NoSessionProviderSymbol | Session | null>(
  NO_SESSION_PROVIDER,
);

export const SessionProvider: FC<
  { session: Session | null } & WithChildren
> = ({ session, children }) => (
  <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
);

export const useSessionContext = () => {
  const theContext = useContext(SessionContext);

  if (theContext === NO_SESSION_PROVIDER) {
    throw new Error("No session provider found");
  }

  return theContext;
};
