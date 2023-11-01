import { Text } from "@mantine/core";
import { type NextPage } from "next";
import { Suspense } from "react";
import { PostCard } from "~/app/posts/_components/post-card";
import { api } from "~/trpc/server";

const LatestPost: NextPage = async () => {
  const latestPost = await api.post.getLatest.query();

  if (!latestPost)
    return <Text className="w-full text-center opacity-80">No posts yet</Text>;

  return <PostCard className="w-full" post={latestPost} />;
};

const Home: NextPage = () => {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-md flex-col items-center">
        <h2 className="mb-2 mr-auto">Latest Post</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <LatestPost />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
