import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import { Tailwind } from "@react-email/tailwind";
import { Body } from "@react-email/body";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import { Head } from "@react-email/head";
import { Preview } from "@react-email/preview";
import { Container } from "@react-email/container";
import { Heading } from "@react-email/heading";

import * as React from "react";
import { format } from "date-fns";

export type AuthConfirmEmailTemplateProps = {
  confirmationUrl: string;
};

const AuthLinkEmailTemplate = ({
  confirmationUrl,
}: AuthConfirmEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Sign In</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-gray-100 font-sans">
        <Container className="w-[465px] border border-gray-200 bg-white p-4">
          <Container>
            <Heading as="h1" className="text-center font-bold text-blue-500 ">
              Test Posts App
            </Heading>
          </Container>
          <Text>
            Welcome to Test Posts App, one of the websites of all time. To sign
            in, click the button below.
          </Text>
          <Section className="text-center">
            <Button
              className="rounded-md bg-blue-500 px-4 py-2 text-white"
              href={confirmationUrl}
            >
              Sign In
            </Button>
          </Section>

          <Section className="text-right">
            <Text className="text-xs opacity-75">
              Sent at: {format(new Date(), "h:mm a LLLL dd yyyy")}
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
export default AuthLinkEmailTemplate;
