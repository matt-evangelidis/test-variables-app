import type { StrictExtract } from "$utility-types";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";

type AppRouterInstance = ReturnType<typeof useRouter>;

type NavigationType = StrictExtract<
  keyof AppRouterInstance,
  "back" | "forward" | "push" | "replace"
>;

type CacheBustedNavigationObject = {
  [Key in NavigationType]: (
    ...params: Parameters<AppRouterInstance[Key]>
  ) => void;
};

export const useCacheBustedNavigation = (): CacheBustedNavigationObject & {
  isLoading: boolean;
} => {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  const getNavigationHandler = useCallback(
    <TypeUsed extends NavigationType>(type: TypeUsed) =>
      (...params: Parameters<AppRouterInstance[TypeUsed]>) => {
        const navigationHandler = router[type];
        startTransition(() => {
          router.refresh();
          navigationHandler(...(params as [never]));
        });
      },
    [router],
  );

  return {
    push: getNavigationHandler("push"),
    replace: getNavigationHandler("replace"),
    back: getNavigationHandler("back"),
    forward: getNavigationHandler("forward"),
    isLoading,
  };
};
