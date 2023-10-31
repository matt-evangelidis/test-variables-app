import { type NextServerPage, type WithChildren } from "$react-types";
import { redirect } from "next/navigation";
import { getServerAuthSession, redirectToSignIn } from "~/server/auth";

const AuthenticatedRoute: NextServerPage<
  WithChildren & { redirectToRoot?: boolean }
> = async ({ children, redirectToRoot = false }) => {
  const session = await getServerAuthSession();

  if (!session?.user) {
    if (redirectToRoot) redirect("/");
    else redirectToSignIn();
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
