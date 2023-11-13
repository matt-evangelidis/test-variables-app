import { generateComponents } from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { type OurFileRouter } from "~/uploadthing/core";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();

export const { uploadFiles: uploadFilesFromClient, useUploadThing } =
  generateReactHelpers<OurFileRouter>();
