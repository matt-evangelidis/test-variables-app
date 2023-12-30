import { atom, useAtom } from "jotai";
import { type ResolvedVariable } from "~/services/variable";
import { useHydrateAtoms } from "jotai/utils";

const variablesAtom = atom<ResolvedVariable[]>([]);
export const useVariables = () => {
  return useAtom(variablesAtom);
};

export const useHydrateVariables = (initialVariables: ResolvedVariable[]) => {
  useHydrateAtoms([[variablesAtom, initialVariables]]);
};
