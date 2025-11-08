"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";

export function ViewMoreList({
  items,
  initialVisible = 5,
  className = "",
}: {
  items: React.ReactNode[];
  initialVisible?: number;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const hasOverflow = items.length > initialVisible;

  return (
    <div className={`relative ${className}`}>
      <ul id={listId} className="space-y-2">
        {expanded ? (
          // Expanded: render everything
          items.map((item) => item)
        ) : (
          // Collapsed: first 5, CTA, and a faded 6th as a hint
          <>
            {items
              .slice(0, Math.min(items.length, initialVisible))
              .map((item) => item)}

            {hasOverflow && (
              <>
                <li>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setExpanded(true)}
                    aria-expanded={expanded}
                    aria-controls={listId}
                    className="text-center w-full cursor-pointer"
                  >
                    View more
                  </Button>
                </li>
              </>
            )}
          </>
        )}
      </ul>
    </div>
  );
}
