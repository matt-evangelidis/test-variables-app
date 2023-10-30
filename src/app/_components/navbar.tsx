import { cx } from "$cx";
import type { WithClassName } from "$react-types";
import { Anchor } from "@mantine/core";
import Link from "next/link";
import type { FC } from "react";
import { SignInButton } from "~/app/_components/sign-in-button";

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
    label: "New Post",
    href: "/posts/new",
  },
];

export const Navbar: FC<WithClassName> = ({ className }) => (
  <nav
    className={cx(
      "flex h-16 w-screen items-center justify-between bg-gray-200 px-2 dark:bg-gray-800",
      className,
    )}
  >
    <div className="w-32" />
    <div className="flex gap-4">
      {navbarItems.map((item) => (
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
