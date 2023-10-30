import type { NextServerPage } from "$react-types";
import { PostForm } from "~/app/posts/_components/post-form";
import AuthenticatedRoute from "~/components/authenticated-route";

const NewPostPage: NextServerPage = () => (
  <AuthenticatedRoute>
    <PostForm
      status={{
        mode: "create",
      }}
    />
  </AuthenticatedRoute>
);

export default NewPostPage;
