import type { ConditionalKeys, IsLiteral } from "type-fest";

export type ExtractLiterals<T extends string | number> = ConditionalKeys<
  {
    [K in T]: IsLiteral<K>;
  },
  true
>;

export type PickLiteral<T> = Pick<T, ExtractLiterals<Exclude<keyof T, symbol>>>;

export type StrictExclude<T, U extends T> = Exclude<T, U>;

export type StrictExtract<T, U extends T> = Extract<T, U>;
