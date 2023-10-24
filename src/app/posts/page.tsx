import type { NextServerPage, WithClassName } from "$react-types";
import { Suspense } from "react";
import { z } from "zod";
import { PostCard } from "~/app/posts/_components/post-card";
import { PostListPaginationControls } from "~/app/posts/_components/post-list-pagination-controls";
import { api } from "~/trpc/server";

const PostListPagination: NextServerPage<
  WithClassName & { currentPage: number }
> = async ({ currentPage, className }) => {
  const totalPostPages = await api.post.getTotalPages.query();

  return (
    <PostListPaginationControls
      className={className}
      currentPage={currentPage}
      totalPostPages={totalPostPages}
    />
  );
};

const paginationParamsSchema = z.object({
  page: z.preprocess(
    (val) => (val === undefined || val === null ? val : Number(val)),
    z.number().int().min(1).default(1),
  ),
});

const PostListPage: NextServerPage = async ({
  searchParams: untypedSearchParams,
}) => {
  const searchparams = paginationParamsSchema.parse(untypedSearchParams);

  const postList = await api.post.getNewestPaginated.query({
    page: searchparams.page,
  });

  const thisIsTheOnlyPage = searchparams.page === 1 && !postList.hasMore;
  return (
    <div className="flex w-full justify-center pt-4">
      <div className="flex w-full max-w-md flex-col px-4">
        <h2 className="mb-8">Latest Posts</h2>
        <div className="mb-8 flex w-full flex-col gap-2">
          {postList.posts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
        {!thisIsTheOnlyPage && (
          <Suspense>
            <PostListPagination
              className="mx-auto"
              currentPage={searchparams.page}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default PostListPage;