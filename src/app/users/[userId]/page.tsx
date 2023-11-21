import { type NextServerPage } from "$react-types";
import { UserProfileForm } from "~/app/users/[userId]/edit/_components/user-profile-form";
import { userProfilePageParamsSchema } from "~/app/users/[userId]/userProfilePageParamsSchema";
import { createServerApi } from "~/trpc/server";

const ProfileViewPage: NextServerPage = async ({ params }) => {
  const api = await createServerApi();
  const { userId: profileUserId } = userProfilePageParamsSchema.parse(params);

  const userProfile = await api.user.getOutwardFacingById(profileUserId);

  return <UserProfileForm user={userProfile} readOnly />;
};

export default ProfileViewPage;

export const dynamic = "force-dynamic";

export const revalidate = 1;
