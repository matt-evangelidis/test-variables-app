import { type NextServerPage } from "$react-types";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/auth/lucia";

const NewUsePage: NextServerPage = async () => {
  const authSession = await getServerAuthSession();

  if (!authSession) redirect("/");

  redirect(`/users/${authSession.user.userId}/edit`);
};

export default NewUsePage;
