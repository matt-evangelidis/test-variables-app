import type { NextPage } from "next";
import type { PropsWithChildren } from "react";
import type { EmptyObject } from "type-fest";

export type WithClassName = {
  className?: string;
};

export type WithChildren = PropsWithChildren;

export type NextServerPageProps = {
  params?: Record<string, string>;
  searchParams?: Record<string, string | string[] | undefined>;
};

export type NextServerPage<
  Props extends Record<string, unknown> = EmptyObject,
> = NextPage<Props & NextServerPageProps>;

export type NextServerComponent<Props = EmptyObject> = NextPage<Props>;
