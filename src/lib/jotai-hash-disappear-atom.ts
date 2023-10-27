import { atomWithHash } from "jotai-location";
import { type PrimitiveAtom, useAtomValue, useSetAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

type HistoryBoundBooleanAtom<T> = PrimitiveAtom<T> & {
  shouldDisappearFromUrl: (v: T) => boolean;
};

const usedKeys = new Set<string>();

/**
 * A disappearing hash atom is a hash atom that will disappear
 * from the URL once a certain condition is met.
 *
 * NOTE: The behaviour of this is controlled by the
 * `useDisappearingHashBooleanAtom` hook, so you must always
 * use that when interfacing with this kind of atom.
 */
export const disappearingHashAtom = <T>(
  key: string,
  initialValue: T,
  shouldDisappearFromUrl: (v: T) => boolean,
): HistoryBoundBooleanAtom<T> => {
  if (usedKeys.has(key)) {
    throw new Error(
      `There is already a disappearing hash atom using the key "${key}"`,
    );
  }
  usedKeys.add(key);
  const atom = atomWithHash<T>(key, initialValue);
  return Object.assign(atom, { shouldDisappearFromUrl });
};

export const uiIsOpenAtom = (key: string) =>
  disappearingHashAtom<boolean>(key, false, (val) => !val);

const getHashFromUrl = (url: string) => {
  const brokenUp = url.split("#");
  const last = brokenUp[brokenUp.length - 1];
  if (last === undefined) return undefined;
  return "#" + last;
};

export const useWipeHashFromUrl = () => {
  const router = useRouter();
  const currentURL = usePathname();

  return useCallback(() => {
    const currentUrlWithoutHash = currentURL.replace(
      getHashFromUrl(currentURL) ?? "",
      "",
    );

    router.replace(currentUrlWithoutHash);
  }, [router, currentURL]);
};

export const useSetDisappearingHashAtom = <T>(
  theAtom: ReturnType<typeof disappearingHashAtom<T>>,
) => {
  const baseSetValue = useSetAtom(theAtom);
  const wipeHashFromUrl = useWipeHashFromUrl();

  const setValue = useCallback(
    (newValue: T) => {
      baseSetValue(newValue);

      if (theAtom.shouldDisappearFromUrl(newValue)) {
        wipeHashFromUrl();
      }
    },
    [baseSetValue, theAtom, wipeHashFromUrl],
  );

  return setValue;
};

export const useDisappearingHashAtom = <T>(
  theAtom: ReturnType<typeof disappearingHashAtom<T>>,
) => {
  const value = useAtomValue(theAtom);
  const setValue = useSetDisappearingHashAtom(theAtom);

  return [value, setValue] as const;
};
