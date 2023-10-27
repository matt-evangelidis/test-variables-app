"use client";

import { useRouter } from "next/navigation";
import { type FC, useEffect, useRef } from "react";

/**
 * Can be rendered by a server component to force the cache to
 * bust on the client. Shouldn't be needed, however nextjs cache
 * stuff seems to be bugged right now and I'm not able to opt out
 * of the cache.
 */
export const BustCache: FC = () => {
  const router = useRouter();
  const hasRefreshedRef = useRef(false);

  useEffect(() => {
    if (!hasRefreshedRef.current) {
      router.refresh();
      hasRefreshedRef.current = true;
    }
  }, [router]);

  return null;
};
