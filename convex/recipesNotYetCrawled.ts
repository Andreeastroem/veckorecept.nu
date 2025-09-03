import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addRecipeToBeCrawled = mutation({
  args: {
    name: v.string(),
    link: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      console.error("Not authenticated");
      return;
    }

    const exisitingRecipe = await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("link"), args.link))
      .first();
    if (exisitingRecipe) {
      if (exisitingRecipe.slug !== args.slug) {
        // No support for changing slugs, updating with old slug
        args.slug = exisitingRecipe.slug;
      }
    }

    const id = await ctx.db.insert("recipesToBeAdded", {
      name: args.name,
      link: args.link,
      user: userId,
      slug: args.slug,
    });

    console.info("added new document with id: ", id);
  },
});

export const getRecipesToBeCrawled = query({
  args: {},
  handler: async (ctx) => {
    const recipes = await ctx.db.query("recipesToBeAdded").collect();
    return recipes;
  },
});
