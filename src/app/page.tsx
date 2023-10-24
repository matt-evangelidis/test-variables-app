import { Divider } from "@mantine/core";
import { type NextPage } from "next";
import { Suspense } from "react";
import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";

const LatestPost: NextPage = async () => {
  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full rounded-md bg-gray-200 p-man_lg dark:bg-gray-800">
      {latestPost && (
        <div>
          <div>{latestPost?.title}</div>
          <div>{latestPost?.content}</div>
        </div>
      )}
      {!latestPost && <div>No posts yet</div>}
    </div>
  );
};
const Home: NextPage = () => {
  return (
    <div className="flex w-full justify-center pt-4">
      <div className="flex w-full max-w-md flex-col items-center px-4">
        <h2 className="mb-2 mr-auto">Latest Post</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <LatestPost />
        </Suspense>

        <Divider className="mb-8 mt-12 w-full" />

        <CreatePost className="w-full" />
      </div>
    </div>
  );
};

export default Home;
