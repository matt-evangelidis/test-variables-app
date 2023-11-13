import { arrayBufferToWebP } from "$browser-webp-converter";
import imageCompression from "browser-image-compression";

const IMAGE_RESOLUTION = 300;

export const compressUserPictureFile = async (file: File): Promise<File> => {
  const compressedFile = await imageCompression(file, {
    maxWidthOrHeight: IMAGE_RESOLUTION,
    maxSizeMB: 0.05,
    maxIteration: 100,
  });

  const fileToUse = compressedFile.size < file.size ? compressedFile : file;

  const webPFile = await (async () => {
    if (fileToUse.type === "image/webp") return fileToUse;

    const compressedFileBlob = await arrayBufferToWebP(
      await fileToUse.arrayBuffer(),
      {
        height: IMAGE_RESOLUTION,
        width: IMAGE_RESOLUTION,
      },
    );

    return new File([compressedFileBlob], `compressed-image.webp`, {
      type: "image/webp",
    });
  })();

  return webPFile;
};
