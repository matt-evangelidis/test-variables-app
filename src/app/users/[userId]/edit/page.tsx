import { type NextServerPage } from "$react-types";
import { UserProfileForm } from "~/app/users/[userId]/edit/_components/user-profile-form";
import { userProfilePageParamsSchema } from "~/app/users/[userId]/userProfilePageParamsSchema";
import AuthenticatedRoute from "~/components/authenticated-route";
import { db } from "~/server/db";

const EditUserProfilePage: NextServerPage = async ({ params }) => {
  const { userId: profileUserId } = userProfilePageParamsSchema.parse(params);

  const fullProfileUser = await db.user.findUniqueOrThrow({
    where: {
      id: profileUserId,
    },
  });

  return (
    <AuthenticatedRoute userMustHaveId={profileUserId}>
      <UserProfileForm user={fullProfileUser} />
    </AuthenticatedRoute>
  );
};

export default EditUserProfilePage;

export const revalidate = 0;
