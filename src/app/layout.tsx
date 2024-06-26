import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import "~/styles/globals.css";
import "~/styles/mantine-customisation.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import {
  ColorSchemeScript,
  type MantineColorScheme,
  MantineProvider,
} from "@mantine/core";
import {
  mantineCssVariablesResolver,
  mantineThemeOverride,
} from "~/mantine-theme";
import { Navbar } from "~/app/_components/navbar";
import { type NextServerPage, type WithChildren } from "$react-types";
import { getServerAuthSession } from "~/auth/lucia";
import { Notifications } from "@mantine/notifications";
import { SessionProvider } from "~/auth/session-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const DEFAULT_COLOR_SCHEME: MantineColorScheme = "auto";

const RootLayout: NextServerPage<WithChildren> = async ({ children }) => {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme={DEFAULT_COLOR_SCHEME} />
      </head>
      <body className={`font-sans ${inter.variable}`}>
        <MantineProvider
          theme={mantineThemeOverride}
          cssVariablesResolver={mantineCssVariablesResolver}
          defaultColorScheme={DEFAULT_COLOR_SCHEME}
        >
          <Notifications position="top-left" />
          <TRPCReactProvider headers={headers()}>
            <SessionProvider session={session}>
              <Navbar className="fixed top-0" />
              <main className="min-h-screen w-full px-4 pt-navbarHeight">
                <div className="flex w-full justify-center pt-4">
                  <div className="flex w-full max-w-md flex-col">
                    {children}
                  </div>
                </div>
              </main>
            </SessionProvider>
          </TRPCReactProvider>
        </MantineProvider>
      </body>
    </html>
  );
};

export default RootLayout;
