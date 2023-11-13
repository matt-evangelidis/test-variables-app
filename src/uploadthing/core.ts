import { type NextRequest } from "next/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "~/auth/lucia";
import { writeUploadResultToDB } from "~/uploadthing/api";

const f = createUploadthing();

const authMiddleware = async ({ req }: { req: NextRequest }) => {
  const authSession = await auth.handleRequest(req).validate();
  // If you throw, the user will not be able to upload
  if (!authSession) throw new Error("Unauthorized");

  // Whatever is returned here is accessible in onUploadComplete as `metadata`
  return { userId: authSession.user.userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(authMiddleware)
    .onUploadComplete(async ({ file }) => {
      await writeUploadResultToDB(file);
    }),

  userPictureUploader: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "64KB",
    },
  })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ file }) => {
      await writeUploadResultToDB(file, {
        isUserPicture: true,
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
