import { type NextServerPage } from "$react-types";
import { redirect } from "next/navigation";
import { SignInForm } from "~/app/auth/sign-in/_components/sign-in-form";
import { getServerAuthSession } from "~/server/auth";

const SignInPage: NextServerPage = async () => {
  const authSession = await getServerAuthSession();

  if (authSession) redirect("/");

  return <SignInForm />;
};

export default SignInPage;
