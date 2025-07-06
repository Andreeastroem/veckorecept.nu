import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addRecipeToBeCrawled = mutation({
  args: {
    name: v.string(),
    link: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate link is a valid URL
    try {
      new URL(args.link);
    } catch {
      throw new Error("Invalid URL provided for recipe link.");
    }

    // Get authenticated user
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User must be authenticated to add a recipe.");
    const user = await ctx.db.get(userId);
    const addedBy = user?.email ?? userId;

    const id = await ctx.db.insert("recipesToBeAdded", {
      name: args.name,
      link: args.link,
      addedBy,
      createdAt: Date.now(),
    });

    console.info("added new document with id: ", id);
  },
});
