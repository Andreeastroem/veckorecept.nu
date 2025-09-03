import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getRecipeByLink = query({
  args: {
    link: v.string(),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("Unauthorized");
    // }
    const recipe = await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("slug"), args.link))
      .first();
    const ingredients = await ctx.db
      .query("ingredients")
      .filter((q) => q.eq(q.field("recipeLink"), recipe?.link))
      .collect();
    return { ...recipe, ingredients };
  },
});

export const getRecipeById = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("Unauthorized");
    // }
    return await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .first();
  },
});

export const getRecipesByUser = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const recipeUsers = await ctx.db
      .query("recipeUsers")
      .withIndex("user", (q) => q.eq("user", userId))
      .collect();
    const recipesPromises = await Promise.allSettled(
      recipeUsers.map(async (recipeUsers) => {
        return ctx.db.get(recipeUsers.recipe);
      }),
    );
    const recipes = recipesPromises
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    //filter out null values from recipes
    const filteredRecipes = recipes.filter((recipe) => recipe !== null);
    return filteredRecipes;
  },
});

export const addRecipeToBeCrawled = mutation({
  args: v.object({
    name: v.string(),
    link: v.string(),
    slug: v.string(),
  }),
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
      exisitingRecipe.isCrawled = false;
      await ctx.db.patch(exisitingRecipe._id, {
        ...exisitingRecipe,
      });

      // Update time on recipeUsers
      const recipeUser = await ctx.db
        .query("recipeUsers")
        .filter((q) => q.eq(q.field("recipe"), exisitingRecipe._id))
        .first();
      if (recipeUser) {
        await ctx.db.patch(recipeUser._id, {
          ...recipeUser,
          updated_at: Date.now(),
        });
      }

      return;
    }

    const recipeId = await ctx.db.insert("recipes", {
      ...args,
      isCrawled: false,
    });
    await ctx.db.insert("recipeUsers", {
      user: userId,
      recipe: recipeId,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
  },
});
