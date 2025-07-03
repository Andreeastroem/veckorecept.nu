import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const addRecipeToBeCrawled = mutation({
  args: {
    name: v.string(),
    link: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("recipesToBeAdded", {
      name: args.name,
      link: args.link,
    });

    console.info("added new document with id: ", id);
  },
});
