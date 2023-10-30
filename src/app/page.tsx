import { type NextPage } from "next";
import { Suspense } from "react";
import { EmailTestButton } from "~/app/_components/email-test-button";
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
        <EmailTestButton className="mb-6" />
        <h2 className="mb-2 mr-auto">Latest Post</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <LatestPost />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
