import { cx } from "$cx";
import type { NextServerPage, WithClassName } from "$react-types";
import { Anchor, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { SignInButton } from "~/app/_components/sign-in-button";
import { getServerAuthSession } from "~/auth/lucia";

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
  {
    label: "Variables",
    href: "/variables",
  },
];

export const Navbar: NextServerPage<WithClassName> = async ({ className }) => {
  const authSession = await getServerAuthSession();
  return (
    <nav
      className={cx(
        "flex h-16 w-screen items-center justify-between bg-gray-200 px-2 dark:bg-gray-800",
        className,
      )}
    >
      <div className="w-20">
        {authSession && (
          <Button component={Link} href="/posts/new" leftSection={<IconPlus />}>
            Post
          </Button>
        )}
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
