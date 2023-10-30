import type { NextServerPage } from "$react-types";
import { PostForm } from "~/app/posts/_components/post-form";
import { individualPostPageParamsSchema } from "~/app/posts/pageParamsSchema";
import AuthenticatedRoute from "~/components/authenticated-route";
import { api } from "~/trpc/server";

const EditPostPage: NextServerPage = async ({ params }) => {
  const { postId } = individualPostPageParamsSchema.parse(params);
  const fullPost = await api.post.getById.query(postId);

  return (
    <AuthenticatedRoute>
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
