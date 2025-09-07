"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function RecipeList() {
  const recipes = useQuery(api.recipe.getRecipesByUser);

  if (!recipes) {
    return null;
  }
  return (
    <div className="space-y-3">
      <div className="text-accent-foreground grid gap-1.5">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Link
              className={`${recipe.isCrawled ? "" : "bg-muted pointer-events-none"} flex justify-between w-full backdrop-blur-sm bg-accent border border-border rounded-xl p-4 hover:bg-accent/90 transition-colors duration-300`}
              href={`/recipe/${recipe.slug}`}
              key={recipe._id}
            >
              {recipe.name}
              {recipe.isCrawled ? null : <span>🛠</span>}
            </Link>
          ))
        ) : (
          <p>No recipes yet. Add your first recipe to get started!</p>
        )}
      </div>
    </div>
  );
}
