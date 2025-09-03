import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  recipesAdded: defineTable({
    link: v.string(),
    name: v.string(),
    user: v.id("users"),
    slug: v.string(),
  }),
  recipesToBeAdded: defineTable({
    link: v.string(),
    name: v.string(),
    user: v.id("users"),
    slug: v.string(),
  }),
  ingredients: defineTable({
    amount: v.union(v.null(), v.array(v.float64())),
    name: v.string(),
    recipeLink: v.string(),
    unit: v.union(v.null(), v.string()),
  }),
  recipes: defineTable({
    slug: v.string(),
    link: v.string(),
    name: v.string(),
    isCrawled: v.boolean(),
  })
    .index("slug", ["slug"])
    .index("link", ["link"])
    .index("isCrawled", ["isCrawled"]),

  recipeUsers: defineTable({
    user: v.id("users"),
    recipe: v.id("recipes"),
    created_at: v.number(),
    updated_at: v.optional(v.number()),
  })
    .index("user", ["user"])
    .index("recipe", ["recipe"]),
});
