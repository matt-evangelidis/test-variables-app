import { type NextServerPage } from "$react-types";
import { UserProfileForm } from "~/app/users/[userId]/edit/_components/user-profile-form";
import { userProfilePageParamsSchema } from "~/app/users/[userId]/userProfilePageParamsSchema";
import AuthenticatedRoute from "~/components/authenticated-route";
import { db } from "~/server/db";

const EditUserProfilePage: NextServerPage = async ({ params }) => {
  const { userId } = userProfilePageParamsSchema.parse(params);

  const fullUser = await db.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  return (
    <AuthenticatedRoute redirectToRoot>
      <UserProfileForm user={fullUser} />
    </AuthenticatedRoute>
  );
};

export default EditUserProfilePage;
