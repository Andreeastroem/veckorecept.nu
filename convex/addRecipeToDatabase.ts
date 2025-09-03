import { mutation, query } from "./_generated/server.js";
import { v } from "convex/values";

export type Ingredient = {
  amount: Array<number> | null;
  unit: string | null;
  name: string;
};

export const getRecipesToBeAdded = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("recipesToBeAdded").collect();
  },
});

export const getAllUnCrawledRecipes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("isCrawled"), false))
      .collect();
  },
});

export const addRecipeToDatabase = mutation({
  args: {
    recipe: v.object({
      id: v.id("recipes"),
      name: v.string(),
      link: v.string(),
      ingredients: v.array(
        v.object({
          amount: v.union(v.array(v.number()), v.null()),
          unit: v.union(v.string(), v.null()),
          name: v.string(),
        }),
      ),
    }),
    user: v.id("users"),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const { recipe, user, slug } = args;

    // Check if the recipe already exists
    const existingRecipeIngredients = await ctx.db
      .query("ingredients")
      .filter((q) => q.eq(q.field("recipeLink"), recipe.link))
      .first();

    const existingRecipe = await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("link"), recipe.link))
      .first();

    if (existingRecipeIngredients && existingRecipe) {
      console.info("Patching recipe");
      // Check if the recipe is up to date
      const existingIngredients = await ctx.db
        .query("ingredients")
        .filter((q) => q.eq(q.field("recipeLink"), recipe.link))
        .collect();

      const uniqueIngredients = inverseIntersection(
        existingIngredients,
        recipe.ingredients,
      );

      if (uniqueIngredients.length > 0) {
        // Update database
        existingIngredients.forEach(async (ingredient) => {
          await ctx.db.delete(ingredient._id);
        });

        recipe.ingredients.forEach(async (ingredient) => {
          await ctx.db.insert("ingredients", {
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            recipeLink: recipe.link,
          });
        });

        // If name differs update it
        if (existingRecipe.name !== recipe.name) {
          await ctx.db.patch(existingRecipe._id, {
            ...existingRecipe,
            name: recipe.name,
          });
        }

        await ctx.db.insert("recipes", {
          name: recipe.name,
          link: recipe.link,
          slug: slug,
          isCrawled: false,
        });

        ctx.db.delete(recipe.id);
      }
    } else {
      console.info("Adding new recipe", recipe.name);
      // Add the new recipe to the database
      await ctx.db.insert("recipes", {
        name: recipe.name,
        link: recipe.link,
        slug: slug,
        isCrawled: false,
      });
      recipe.ingredients.forEach(async (ingredient) => {
        await ctx.db.insert("ingredients", {
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          recipeLink: recipe.link,
        });
      });

      await ctx.db.delete(recipe.id);
    }
  },
});

export const addRecipeToBeAddedDatabase = mutation({
  args: {
    recipe: v.object({
      id: v.id("recipesToBeAdded"),
      name: v.string(),
      link: v.string(),
      ingredients: v.array(
        v.object({
          amount: v.union(v.array(v.number()), v.null()),
          unit: v.union(v.string(), v.null()),
          name: v.string(),
        }),
      ),
    }),
    user: v.id("users"),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const { recipe, user, slug } = args;

    // Check if the recipe already exists
    const existingRecipeIngredients = await ctx.db
      .query("ingredients")
      .filter((q) => q.eq(q.field("recipeLink"), recipe.link))
      .first();

    const existingRecipe = await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("link"), recipe.link))
      .first();

    if (existingRecipeIngredients && existingRecipe) {
      console.info("Patching recipe");
      // Check if the recipe is up to date
      const existingIngredients = await ctx.db
        .query("ingredients")
        .filter((q) => q.eq(q.field("recipeLink"), recipe.link))
        .collect();

      const uniqueIngredients = inverseIntersection(
        existingIngredients,
        recipe.ingredients,
      );

      if (uniqueIngredients.length > 0) {
        // Update database
        existingIngredients.forEach(async (ingredient) => {
          await ctx.db.delete(ingredient._id);
        });

        recipe.ingredients.forEach(async (ingredient) => {
          await ctx.db.insert("ingredients", {
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            recipeLink: recipe.link,
          });
        });

        // If name differs update it
        if (existingRecipe.name !== recipe.name) {
          await ctx.db.patch(existingRecipe._id, {
            ...existingRecipe,
            name: recipe.name,
          });
        }

        await ctx.db.insert("recipes", {
          name: recipe.name,
          link: recipe.link,
          slug: slug,
          isCrawled: false,
        });

        await ctx.db.insert("recipesAdded", {
          link: recipe.link,
          name: recipe.name,
          user: user,
          slug: slug,
        });

        ctx.db.delete(recipe.id);
      }
    } else {
      console.info("Adding new recipe", recipe.name);
      // Add the new recipe to the database
      await ctx.db.insert("recipes", {
        name: recipe.name,
        link: recipe.link,
        slug: slug,
        isCrawled: false,
      });
      recipe.ingredients.forEach(async (ingredient) => {
        await ctx.db.insert("ingredients", {
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          recipeLink: recipe.link,
        });
      });

      await ctx.db.insert("recipesAdded", {
        link: recipe.link,
        name: recipe.name,
        user: args.user,
        slug: slug,
      });

      await ctx.db.delete(recipe.id);
    }
  },
});

function intersection(
  ingredientArrayA: Ingredient[],
  ingredientArrayB: Ingredient[],
) {
  return ingredientArrayA.filter((ingredientA) =>
    ingredientArrayB.find(
      (ingredientB) => ingredientA.name === ingredientB.name,
    ),
  );
}

function inverseIntersection(
  IngredientArrayA: Ingredient[],
  ingredientArrayB: Ingredient[],
) {
  const allIngredients = [...IngredientArrayA, ...ingredientArrayB];

  const ingredientIntersection = intersection(
    IngredientArrayA,
    ingredientArrayB,
  );

  // all ingredients minus ingredientIntersection
  return allIngredients.filter((ingredient) => {
    return !ingredientIntersection.find(
      (intersectionIngredient) =>
        intersectionIngredient.name === ingredient.name,
    );
  });
}

function test() {
  const testArrayA: Ingredient[] = [
    { name: "A", amount: null, unit: null },
    { name: "B", amount: null, unit: null },
    { name: "C", amount: null, unit: null },
  ];
  const testArrayB: Ingredient[] = [
    { name: "B", amount: null, unit: null },
    { name: "C", amount: null, unit: null },
    { name: "D", amount: null, unit: null },
  ];

  const ingredientsUniqueToEither = inverseIntersection(testArrayA, testArrayB);

  console.info(
    JSON.stringify(
      ingredientsUniqueToEither.map((ingredient) => ingredient.name),
      null,
      2,
    ),
  );
}
