import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { uploadthingAPI } from "~/uploadthing/api";

export const DELETE = async () => {
  const deleteResult = await db.$transaction(async (transactionalDB) => {
    const unusedUserPictures = await transactionalDB.uploadedImage.findMany({
      where: {
        isUserPicture: true,
        beingUsedByUsers: {
          none: {},
        },
      },
    });

    if (unusedUserPictures.length === 0)
      return {
        count: 0,
      };

    const keysOfImagesToDelete = unusedUserPictures.map((image) => image.key);

    const deleteResult = await transactionalDB.uploadedImage.deleteMany({
      where: {
        key: {
          in: keysOfImagesToDelete,
        },
      },
    });

    await uploadthingAPI.deleteFiles(keysOfImagesToDelete);

    return deleteResult;
  });

  console.log(`Deleted ${deleteResult.count} unused user pictures`);

  return NextResponse.json({
    deletedImages: deleteResult.count,
  });
};
