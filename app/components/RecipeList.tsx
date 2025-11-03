"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ViewMoreList } from "@/components/ui/viewMoreList";
import { api } from "@/convex/_generated/api";
import { DataModel } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";

export default function RecipeLinkList() {
  const recipeLinks = useQuery(api.recipe.getRecipeLinksByUser);
  const [isOpen, setIsOpen] = useState(false);

  if (!recipeLinks) {
    return null;
  }
  return (
    <div className="space-y-3">
      <div className="text-accent-foreground grid gap-1.5">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <ViewMoreList
            items={recipeLinks.map((recipeLink) => {
              return (
                <div
                  key={recipeLink._id}
                  className="flex justify-between w-full backdrop-blur-sm bg-accent border border-border rounded-xl p-4 hover:bg-accent/90 transition-colors duration-300"
                >
                  <Link
                    className={`${recipeLink.isCrawled ? "" : "bg-muted pointer-events-none"}`}
                    href={`/recipe/${recipeLink.slug}`}
                  >
                    {recipeLink.name}
                  </Link>
                  <StatusSymbol
                    isCrawled={recipeLink.isCrawled}
                    retries={recipeLink.retries}
                  />
                </div>
              );
            })}
            initialVisible={5}
          />
        </Collapsible>
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
