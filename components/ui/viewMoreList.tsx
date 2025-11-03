"use client";

import { useId, useState } from "react";
import Link from "next/link";
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
                  >
                    View more
                  </Button>
                </li>

                {/* Faded sixth item as a visual cue */}
                {items[initialVisible] && (
                  <li
                    aria-hidden="true"
                    className="opacity-50 pointer-events-none select-none"
                  >
                    <span className="underline text-muted-foreground">
                      {items[initialVisible]}
                    </span>
                  </li>
                )}
              </>
            )}
          </>
        )}
      </ul>

      {/* Bottom fade for a nice hint while collapsed */}
      {!expanded && hasOverflow && (
        <div className="pointer-events-none absolute inset-x-0 -bottom-2 h-10 bg-gradient-to-b from-transparent to-background" />
      )}
    </div>
  );
}
