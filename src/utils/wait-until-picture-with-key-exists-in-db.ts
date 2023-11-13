import { retryUntil } from "$retry-until";
import { api } from "~/trpc/client";

export const waitUntilPictureWithKeyExistsInDb = async (pictureKey: string) =>
  retryUntil(
    () => api.image.getURLByKey.query(pictureKey),
    (url) => url !== undefined,
    {
      maxTries: 10,
    },
  );
