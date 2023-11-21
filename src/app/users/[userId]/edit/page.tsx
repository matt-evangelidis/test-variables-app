import { type NextServerPage } from "$react-types";
import { UserProfileForm } from "~/app/users/[userId]/edit/_components/user-profile-form";
import { userProfilePageParamsSchema } from "~/app/users/[userId]/userProfilePageParamsSchema";
import AuthenticatedRoute from "~/components/authenticated-route";
import { createServerApi } from "~/trpc/server";

const EditUserProfilePage: NextServerPage = async ({ params }) => {
  const api = await createServerApi();
  const { userId: profileUserId } = userProfilePageParamsSchema.parse(params);

  const fullProfileUser = await api.user.getInwardFacingById(profileUserId);

  return (
    <AuthenticatedRoute userMustHaveId={profileUserId}>
      <UserProfileForm user={fullProfileUser} />
    </AuthenticatedRoute>
  );
};

export default EditUserProfilePage;

export const revalidate = 0;
