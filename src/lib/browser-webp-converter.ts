/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// Credit: https://github.com/juunini/webp-converter-browser/blob/main/src/index.ts

interface Options {
  quality?: number;
  width?: number;
  height?: number;
}

const DEFAULT_QUALITY = 0.75;

/**
 * When it cause CORS, you may failed to use
 */
export function srcToWebP(
  src: string,
  { quality, width, height }: Options = {},
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return reject(new Error("Failed to get canvas context"));

    const image = new Image();
    image.src = src;
    image.crossOrigin = "anonymous";
    image.onload = (e) => {
      canvas.width = width ?? image.width;
      canvas.height = height ?? image.height;
      // @ts-ignore
      URL.revokeObjectURL(e.target.src);
      // @ts-ignore
      context.drawImage(e.target, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (data) => {
          if (!data) return reject(new Error("Failed to convert to blob"));
          resolve(data);
        },
        "image/webp",
        quality ?? DEFAULT_QUALITY,
      );
    };
    image.onerror = (e) => reject(e);
  });
}

export function blobToWebP(
  data: Blob,
  { quality, width, height }: Options = {},
): Promise<Blob> {
  return srcToWebP(URL.createObjectURL(data), { quality, width, height });
}

export function arrayBufferToWebP(
  data: ArrayBuffer,
  { quality, width, height }: Options = {},
): Promise<Blob> {
  return blobToWebP(new Blob([data]), { quality, width, height });
}
