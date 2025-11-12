"use client";

import RecipeLinkListCard from "@/components/recipeLinks/ListCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";

// Page size constant; adjust if you want different slice sizes.
const PAGE_SIZE = 5;

/**
 * Classic numbered pagination built on top of Convex's cursor pagination.
 * Strategy: load enough items to cover requested page (page * PAGE_SIZE) then slice.
 * This avoids custom offset logic while keeping future filter/search additions simple
 * (changing the arguments will cause Convex to re-run & reset the cursor).
 */
export default function PaginatedRecipeLinkList() {
  // Future filters/search (stub). When any of these change we reset page back to 1.
  const [search, setSearch] = useState(""); // text search (client-side stub for now)
  // Example tag/ingredient filters placeholders; not yet wired.
  const [tags] = useState<string[]>([]);
  const [includeIngredients] = useState<string[]>([]);

  const [page, setPage] = useState(1); // 1-based page index

  // Reset page when search or filters change.
  useEffect(() => {
    setPage(1);
  }, [search, tags, includeIngredients]);

  // Query key args kept minimal now; add filterOptions server-side later.
  const pagination = usePaginatedQuery(
    api.recipe.getCrawledRecipeLinksPagination,
    {
      // server expects { paginationOpts, filterOptions }; passing empty opts uses defaults.
      // We pass no filterOptions yet; when implementing filters, include them here so Convex cache keys change.
    },
    { initialNumItems: PAGE_SIZE },
  );

  // Ensure we have enough loaded items for current page; request the gap only.
  useEffect(() => {
    const needed = page * PAGE_SIZE;
    if (
      pagination.results.length < needed &&
      pagination.status === "CanLoadMore"
    ) {
      const gap = needed - pagination.results.length;
      pagination.loadMore(gap);
    }
  }, [page, pagination.results.length, pagination.status]);

  // Slice results for current page.
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return pagination.results.slice(start, end);
  }, [page, pagination.results]);

  // Compute whether more pages exist. If we can load more or current results align with page size & not exhausted.
  const hasMore = pagination.status === "CanLoadMore";
  // Approximate total pages: (loaded length + (hasMore ? PAGE_SIZE : 0)) / PAGE_SIZE rounded up.
  const totalPages = useMemo(() => {
    if (!hasMore) {
      return Math.max(1, Math.ceil(pagination.results.length / PAGE_SIZE));
    }
    // We don't know the true total yet; estimate based on current length. This prevents rendering too few page numbers.
    return Math.max(
      page + (hasMore ? 1 : 0),
      Math.ceil(pagination.results.length / PAGE_SIZE),
    );
  }, [pagination.results.length, hasMore, page]);

  // Generate page number array. Limit to a reasonable window if pages grow (e.g., show +/-2). For now show all.
  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <div className="space-y-4">
      {/* Search stub: implement server-side filtering later */}
      {/* <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recipes" /> */}

      <ul className="space-y-1">
        {pageItems.map((recipe) => (
          <RecipeLinkListCard key={recipe._id} recipe={recipe} />
        ))}
        {/* Loading skeleton rows (optional) */}
        {pagination.isLoading && pageItems.length === 0 && (
          <li>
            <Skeleton className="w-full h-8" />
          </li>
        )}
      </ul>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-disabled={page === 1}
            />
          </PaginationItem>
          {pageNumbers.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => nextPage(p, hasMore, totalPages))}
              aria-disabled={!hasMore && page >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Global loading indicator */}
      <Skeleton
        className={`w-full h-2 ${pagination.isLoading ? "block" : "hidden"}`}
      />
    </div>
  );
}

function nextPage(pageNumber: number, hasMore: boolean, totalPages: number) {
  if (pageNumber < totalPages) {
    return pageNumber + 1;
  }

  if (hasMore) {
    return pageNumber + 1;
  }

  return pageNumber;
}
