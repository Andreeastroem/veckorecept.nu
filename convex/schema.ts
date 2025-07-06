import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  recipesToBeAdded: defineTable({
    name: v.string(),
    link: v.string(),
    addedBy: v.string(),
    createdAt: v.number(),
  }),
});
