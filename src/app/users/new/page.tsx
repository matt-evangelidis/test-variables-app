import { type NextServerPage } from "$react-types";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

const NewUsePage: NextServerPage = async () => {
  const authSession = await getServerAuthSession();

  if (!authSession) redirect("/");

  redirect(`/users/${authSession.user.id}/edit`);
};

export default NewUsePage;
