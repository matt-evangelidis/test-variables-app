import { cx } from "$cx";
import type { NextServerPage, WithClassName } from "$react-types";
import { Anchor } from "@mantine/core";
import Link from "next/link";
import { SignInButton } from "~/app/_components/sign-in-button";
import { createServerApi } from "~/trpc/server";
import { Suspense } from "react";
import { VariableDrawer } from "~/app/_components/variables/variable-drawer";

type NavbarItem = {
  label: string;
  href: string;
};

const navbarItems: NavbarItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Posts",
    href: "/posts",
  },
];

export const Navbar: NextServerPage<WithClassName> = async ({ className }) => {
  // const authSession = await getServerAuthSession();
  const api = await createServerApi();
  const variables = await api.variable.getAll();
  return (
    <nav
      className={cx(
        "flex h-16 w-screen items-center justify-between bg-gray-200 px-2 dark:bg-gray-800",
        className,
      )}
    >
      <div className="w-20">
        <Suspense>
          <VariableDrawer initialVariables={variables} />
        </Suspense>
        {/*{authSession && (*/}
        {/*  <Button component={Link} href="/posts/new" leftSection={<IconPlus />}>*/}
        {/*    Post*/}
        {/*  </Button>*/}
        {/*)}*/}
      </div>
      <div className="flex gap-4">
        {navbarItems.map((item) => (
          <Anchor component={Link} href={item.href} key={item.href}>
            {item.label}
          </Anchor>
        ))}
      </div>
      <div className="flex w-20 justify-end">
        <SignInButton variant="subtle" />
      </div>
    </nav>
  );
};
