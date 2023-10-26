import { cx } from "$cx";
import type { WithClassName } from "$react-types";
import { Anchor } from "@mantine/core";
import Link from "next/link";
import type { FC } from "react";

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
      "flex h-16 w-screen items-center justify-center gap-4 bg-gray-200 dark:bg-gray-800",
      className,
    )}
  >
    {navbarItems.map((item) => (
      <Anchor
        // className="flex w-16 justify-center rounded-sm border py-1"
        component={Link}
        href={item.href}
        key={item.href}
      >
        {item.label}
      </Anchor>
    ))}
  </nav>
);
