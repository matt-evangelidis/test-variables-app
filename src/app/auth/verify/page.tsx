import { type NextServerPage } from "$react-types";
import { Button, Text } from "@mantine/core";
import { z } from "zod";
import { consumeVerificationToken } from "~/app/actions";

const searchParamsSchema = z.object({
  token: z.string(),
});

const VerifyEmailPage: NextServerPage = ({ searchParams }) => {
  const { token } = searchParamsSchema.parse(searchParams);

  const consumeOurToken = consumeVerificationToken.bind(null, token);

  return (
    <form className="flex flex-col items-center gap-2" action={consumeOurToken}>
      <Text className="font-bold">Click the button below to sign in</Text>
      <Button type="submit">Sign In</Button>
    </form>
  );
};

export default VerifyEmailPage;
