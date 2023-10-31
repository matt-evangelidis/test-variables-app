import { randomItemFromArray } from "$array-helpers";

const ANIMAL_NAMES = [
  "dog",
  "cat",
  "elephant",
  "tiger",
  "lion",
  "giraffe",
  "zebra",
  "rhinoceros",
  "cheetah",
  "kangaroo",
  "panda",
  "gorilla",
  "hippopotamus",
  "koala",
  "ostrich",
  "penguin",
  "crocodile",
  "parrot",
  "squirrel",
  "octopus",
  "dolphin",
  "shark",
  "jaguar",
  "lemur",
  "lemming",
  "lynx",
  "otter",
  "platypus",
  "python",
];

const COLORS = [
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "cyan",
  "magenta",
  "lime",
  "teal",
  "indigo",
  "violet",
  "maroon",
  "turquoise",
  "gold",
  "silver",
  "gray",
  "black",
  "white",
  "beige",
  "navy",
  "olive",
  "aqua",
  "coral",
  "mint",
  "lavender",
  "slate",
];

const generateRandomTwoDigitNumber = () => {
  return Math.floor(Math.random() * 100);
};

export const generateRandomUserName = (): string => {
  const color = randomItemFromArray(COLORS);
  const animal = randomItemFromArray(ANIMAL_NAMES);
  const twoDigitNumber = generateRandomTwoDigitNumber();

  return `${color}-${animal}-${twoDigitNumber}`;
};
