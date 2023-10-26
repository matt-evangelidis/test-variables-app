import "~/styles/globals.css";
import "@mantine/core/styles.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <TRPCReactProvider headers={headers()}>
            <Navbar className="fixed top-0" />
            <main className="min-h-screen w-full pt-navbarHeight">
              <div className="flex h-navbarHeight w-full justify-center pt-4">
                <div className="flex w-full max-w-md flex-col px-4">
                  {children}
                </div>
              </div>
            </main>
          </TRPCReactProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
