import type { NextPage } from "next";
import type { EmptyObject } from "type-fest";

export type WithClassName = {
  className?: string;
};

export type NextServerComponentProps = {
  params?: Record<string, string>;
  searchParams?: Record<string, string | string[] | undefined>;
};

export type NextServerPage<
  Props extends Record<string, unknown> = EmptyObject,
> = NextPage<Props & NextServerComponentProps>;
