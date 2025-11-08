"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";

export default function PaginatedRecipeLinkList() {
  const pagination = usePaginatedQuery(
    api.recipe.getCrawledRecipeLinksPagination,
    {},
    { initialNumItems: 5 },
  );

  return (
    <>
      <ul>
        {pagination.results.map((recipe) => {
          return <li key={recipe._id}>{recipe.name}</li>;
        })}
      </ul>
      <Pagination>
        <PaginationContent>
          <PaginationItem></PaginationItem>
        </PaginationContent>
      </Pagination>
      <Skeleton
        className={`w-full h-8 ${pagination.isLoading ? "skeleton" : "hidden"}`}
      />
    </>
  );
}
