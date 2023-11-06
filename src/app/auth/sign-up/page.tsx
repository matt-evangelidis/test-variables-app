import { type NextServerPage } from "$react-types";
import { redirect } from "next/navigation";
import { SignUpForm } from "~/app/auth/sign-up/_components/sign-up-form";
import { getServerAuthSession } from "~/auth/lucia";

const SignUpPage: NextServerPage = async () => {
  const authSession = await getServerAuthSession();

  if (authSession) redirect("/");

  return <SignUpForm />;
};

export default SignUpPage;
