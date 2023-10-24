"use client";

import type { WithClassName } from "$react-types";
import { Pagination } from "@mantine/core";
import Link from "next/link";
import type { FC } from "react";

export const PostListPaginationControls: FC<
  {
    currentPage: number;
    totalPostPages: number;
  } & WithClassName
> = ({ currentPage, className, totalPostPages }) => {
  return (
    <Pagination
      className={className}
      total={totalPostPages}
      value={currentPage}
      getControlProps={(direction) => {
        let pageNumber = currentPage;

        switch (direction) {
          case "first":
            pageNumber = 1;
            break;
          case "last":
            pageNumber = totalPostPages;
            break;
          case "next":
            pageNumber = currentPage + 1;
            break;
          case "previous":
            pageNumber = currentPage - 1;
            break;
        }
        return {
          component: Link,
          href: `/posts?page=${pageNumber}`,
          onClick: (event: MouseEvent) => {
            console.log("Got Clicked");

            const pageNumberIsInvalid =
              pageNumber < 1 || pageNumber > totalPostPages;
            if (pageNumberIsInvalid) event.preventDefault();
          },
        };
      }}
      getItemProps={(pageNumber) => ({
        component: Link,
        href: `/posts?page=${pageNumber}`,
      })}
    />
  );
};
