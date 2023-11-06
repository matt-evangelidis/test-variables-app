import { type NextServerPage, type WithChildren } from "$react-types";
import { Alert, Anchor } from "@mantine/core";
import { redirect } from "next/navigation";
import { getServerAuthSession, redirectToSignIn } from "~/auth/lucia";
import { IconAlertCircle } from "@tabler/icons-react";
import Link from "next/link";

const AuthenticatedRoute: NextServerPage<
  WithChildren & {
    redirectTo?: string;
    userMustHaveId?: string;
    incorrectUserRedirectTo?: string;
  }
> = async ({
  children,
  redirectTo,
  userMustHaveId,
  incorrectUserRedirectTo,
}) => {
  const session = await getServerAuthSession();

  const userIsAuthenticatedButIsNotCorrectUser =
    session?.user &&
    userMustHaveId !== undefined &&
    session.user.userId !== userMustHaveId;

  if (!session?.user) {
    if (redirectTo !== undefined) redirect(redirectTo);
    else redirectToSignIn();
  }

  if (
    userIsAuthenticatedButIsNotCorrectUser &&
    incorrectUserRedirectTo !== undefined
  ) {
    redirect(incorrectUserRedirectTo);
  }

  if (userIsAuthenticatedButIsNotCorrectUser) {
    return (
      <Alert
        title="Forbidden"
        variant="outline"
        color="yellow"
        icon={<IconAlertCircle />}
      >
        <div className="mb-2">
          You do not have permission to view this page.
        </div>
        <Anchor component={Link} href="/" size="sm">
          Return Home
        </Anchor>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
