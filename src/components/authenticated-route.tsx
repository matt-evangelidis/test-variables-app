import { type NextServerPage, type WithChildren } from "$react-types";
import { getServerAuthSession, redirectToSignIn } from "~/server/auth";

const AuthenticatedRoute: NextServerPage<WithChildren> = async ({
  children,
}) => {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirectToSignIn();
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
