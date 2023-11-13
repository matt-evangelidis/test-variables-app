import { createNextRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "~/uploadthing/core";

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});
