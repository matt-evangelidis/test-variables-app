import type { StrictExtract } from "$utility-types";
import { useRouter } from "next/navigation";
import { startTransition, useCallback, useState } from "react";

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

type NavigationLoadingInfo = {
  url?: string;
  type: NavigationType;
};

export const useCacheBustedNavigation = (): CacheBustedNavigationObject & {
  loading: NavigationLoadingInfo | undefined;
} => {
  const router = useRouter();
  const [loadingInformation, setLoadingInformation] = useState<
    NavigationLoadingInfo | undefined
  >(undefined);

  const getNavigationHandler = useCallback(
    <TypeUsed extends NavigationType>(type: TypeUsed) =>
      (...params: Parameters<AppRouterInstance[TypeUsed]>) => {
        const navigationHandler = router[type];
        const urlIfPresent =
          typeof params[0] === "string" ? params[0] : undefined;
        setLoadingInformation({
          type,
          url: urlIfPresent,
        });
        startTransition(() => {
          router.refresh();
          navigationHandler(...(params as [never]));
          setLoadingInformation(undefined);
        });
      },
    [router],
  );

  // useEffect(() => {
  //   if (!isLoading) {
  //     setLoadingInformation(undefined);
  //   }
  // }, [isLoading]);

  return {
    push: getNavigationHandler("push"),
    replace: getNavigationHandler("replace"),
    back: getNavigationHandler("back"),
    forward: getNavigationHandler("forward"),
    loading: loadingInformation,
  };
};
