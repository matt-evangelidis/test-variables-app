import "server-only";

import { UTApi } from "uploadthing/server";
import { db } from "~/server/db";

export const uploadthingAPI = new UTApi();

type WriteUploadResultToDBExtraOptions = {
  isUserPicture: boolean;
};

export const writeUploadResultToDB = (
  uploadedFile: {
    key: string;
    url: string;
    size: number;
  },
  optionsOverride: Partial<WriteUploadResultToDBExtraOptions> = {},
) => {
  const { isUserPicture }: WriteUploadResultToDBExtraOptions = {
    isUserPicture: false,
    ...optionsOverride,
  };

  return db.uploadedImage.create({
    data: {
      key: uploadedFile.key,
      url: uploadedFile.url,
      size: uploadedFile.size,
      isUserPicture,
    },
  });
};

export const deleteImageByKey = (imageKey: string) =>
  db.$transaction(async (transactionalDB) => {
    await transactionalDB.uploadedImage.delete({
      where: { key: imageKey },
    });

    await uploadthingAPI.deleteFiles(imageKey);
  });
