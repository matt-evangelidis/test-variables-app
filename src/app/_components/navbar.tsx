import { cx } from "$cx";
import type { NextServerPage, WithClassName } from "$react-types";
import { Anchor } from "@mantine/core";
import Link from "next/link";
import { SignInButton } from "~/app/_components/sign-in-button";
import { getServerAuthSession } from "~/server/auth";

type NavbarItem = {
  label: string;
  href: string;
  authenticated?: boolean;
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
  {
    label: "New Post",
    href: "/posts/new",
    authenticated: true,
  },
];

export const Navbar: NextServerPage<WithClassName> = async ({ className }) => {
  const authSession = await getServerAuthSession();

  const finalNavbarItems = navbarItems.filter(
    (item) => !item.authenticated || !!item.authenticated === !!authSession,
  );
  return (
    <nav
      className={cx(
        "flex h-16 w-screen items-center justify-between bg-gray-200 px-2 dark:bg-gray-800",
        className,
      )}
    >
      <div className="w-32" />
      <div className="flex gap-4">
        {finalNavbarItems.map((item) => (
          <Anchor component={Link} href={item.href} key={item.href}>
            {item.label}
          </Anchor>
        ))}
      </div>
      <div className="flex w-32 justify-end">
        <SignInButton />
      </div>
    </nav>
  );
};
