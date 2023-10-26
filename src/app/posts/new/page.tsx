import type { NextServerPage } from "$react-types";
import { PostForm } from "~/app/posts/_components/post-form";

const NewPostPage: NextServerPage = () => (
  <PostForm
    status={{
      mode: "create",
    }}
  />
);

export default NewPostPage;
