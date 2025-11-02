"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function RecipeList() {
  const recipes = useQuery(api.recipe.getRecipeLinksByUser);

  if (!recipes) {
    return null;
  }
  return (
    <div className="space-y-3">
      <div className="text-accent-foreground grid gap-1.5">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="flex justify-between w-full backdrop-blur-sm bg-accent border border-border rounded-xl p-4 hover:bg-accent/90 transition-colors duration-300"
            >
              <Link
                className={`${recipe.isCrawled ? "" : "bg-muted pointer-events-none"}`}
                href={`/recipe/${recipe.slug}`}
              >
                {recipe.name}
              </Link>
              <StatusSymbol
                isCrawled={recipe.isCrawled}
                retries={recipe.retries}
              />
            </div>
          ))
        ) : (
          <p>No recipes yet. Add your first recipe to get started!</p>
        )}
      </div>
    </div>
  );
}

function StatusSymbol({
  isCrawled,
  retries,
}: {
  isCrawled: boolean;
  retries: number;
}) {
  if (retries >= 5) {
    return <FailedToCrawl />;
  }
  if (!isCrawled) {
    return <NotYetCrawled />;
  }

  return null;
}

function FailedToCrawl() {
  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger>❌</TooltipTrigger>
      <TooltipContent hideArrow className="bg-gray-50">
        Could not crawl the link - this might be fixed in later versions
      </TooltipContent>
    </Tooltip>
  );
}

function NotYetCrawled() {
  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger>🛠</TooltipTrigger>
      <TooltipContent hideArrow className="bg-gray-50">
        Recipe is not yet crawled
      </TooltipContent>
    </Tooltip>
  );
}
