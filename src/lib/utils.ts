export const keys = <TheObject extends Record<string, unknown>>(
  obj: TheObject,
) => Object.keys(obj) as (keyof TheObject)[];

export const reduceToObject = <Element, Key extends string, Value>(
  items: Element[],
  keyGenerator: (element: Element, index: number, list: Element[]) => Key,
  valueGenerator: (
    element: Element,
    key: Key,
    index: number,
    list: Element[],
  ) => Value,
): Record<Key, Value> => {
  const result = {} as Record<Key, Value>;

  items.forEach((item, index, fullList) => {
    const key = keyGenerator(item, index, fullList);
    const value = valueGenerator(item, key, index, fullList);

    result[key] = value;
  });

  return result;
};

const _ = Symbol();

type YOU_FORGOT<MissingTypes> = {
  ERROR: "DOES NOT CONTAIN ALL TYPES";
  missingTypes: MissingTypes;
  _: typeof _;
};
// When actually used with `arrayOfAll` the IDE should
// flatten this out in the error pop up window to actually
// list out the forgotten types, eg;
// `YOU_FORGOT<"a" | "b">` if "a" and "b" were left out
// of the array.

export const arrayOfAll =
  <T>() =>
  <U extends T[]>(
    array: U &
      ([T] extends [U[number]]
        ? unknown
        : YOU_FORGOT<Exclude<T, U[number]>>) & {
        0: T;
      },
  ) =>
    array;
