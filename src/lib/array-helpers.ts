export const randomItemFromArray = <T>(array: T[]): T => {
  if (array.length === 0) {
    throw new Error("Cannot get random item from empty array");
  }

  const item = array[Math.floor(Math.random() * array.length)];

  return item as T;
};
