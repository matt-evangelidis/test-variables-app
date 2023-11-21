import type { NextServerPage } from "$react-types";
import { PostForm } from "~/app/posts/_components/post-form";
import { individualPostPageParamsSchema } from "~/app/posts/pageParamsSchema";
import AuthenticatedRoute from "~/components/authenticated-route";
import { createServerApi } from "~/trpc/server";

const EditPostPage: NextServerPage = async ({ params }) => {
  const api = await createServerApi();
  const { postId } = individualPostPageParamsSchema.parse(params);

  const fullPost = await api.post.getById(postId);

  return (
    <AuthenticatedRoute userMustHaveId={fullPost.authorUserId}>
      <PostForm
        status={{
          mode: "edit",
          data: {
            post: fullPost,
          },
        }}
      />
    </AuthenticatedRoute>
  );
};

export default EditPostPage;
