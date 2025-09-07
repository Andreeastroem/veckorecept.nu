// modernCrawler.ts
import { findRecipeJsonLD } from "./parser.js";
import fetchParsedIngredients from "./ingredient-parser.js";
import { api, internal } from "../convex/_generated/api.js";
import { GenericActionCtx } from "convex/server";
import { DataModel } from "../convex/_generated/dataModel.js";

export async function crawlRecipes(ctx: GenericActionCtx<DataModel>) {
  const recipesToCrawl = (
    await ctx.runQuery(api.recipe.getAllUncrawledRecipes)
  ).filter((uncrawledRecipes) => uncrawledRecipes !== null);

  const pendingCrawls = recipesToCrawl.map(async (recipe) => {
    return {
      ingredients: await crawlRecipeFromUrl(recipe.link),
      name: recipe.name,
      link: recipe.link,
      user: recipe.user,
      id: recipe._id,
    };
  });

  const recipes = (await Promise.allSettled(pendingCrawls)).filter((result) => {
    if (result.status === "fulfilled") {
      return result.value.ingredients !== null;
    }
    return false;
  });

  const recipesAddedToDatabase = await Promise.allSettled(
    recipes.map(async (result) => {
      if (result.status === "fulfilled") {
        const ingredients = result.value.ingredients;
        if (ingredients) {
          await ctx.runMutation(
            internal.addRecipeToDatabase.addRecipeToDatabase,
            {
              recipe: {
                name: result.value.name,
                link: result.value.link,
                id: result.value.id,
                ingredients,
              },
            },
          );
        }
      } else {
        console.error("Failed to crawl recipe:", result.reason);
      }
    }),
  );

  if (recipesAddedToDatabase.some((failed) => failed.status === "rejected")) {
    console.error("Some recipes failed to add to the database");
  }
}

async function crawlRecipeFromUrl(url: string) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "RecipeBot/1.0" },
    });

    if (!res.ok) {
      console.error(`Failed to fetch ${url}: ${res.status}`);
      return null;
    }

    const html = await res.text();

    const recipejsonLd = findRecipeJsonLD(html);

    if (!recipejsonLd) {
      console.error(`No recipe found in JSON-LD for ${url}`);
    }

    return await getIngredientsFromHTML(html);
  } catch (err) {
    console.error(`Failed to fetch ${url}`, err);
    return null;
  }
}

async function getIngredientsFromHTML(html: string) {
  const recipeJsonLd = findRecipeJsonLD(html);
  if (recipeJsonLd) {
    const ingredientLines =
      recipeJsonLd.recipeIngredient ?? recipeJsonLd.ingredients ?? [];
    let ingredients: Pick<
      DataModel["ingredients"]["document"],
      "amount" | "unit" | "name"
    >[] = [];
    if (!Array.isArray(ingredientLines)) {
      ingredients = fetchParsedIngredients([ingredientLines]);
    } else {
      ingredients = fetchParsedIngredients(ingredientLines);
    }

    if (!ingredients || ingredients.length === 0) {
      console.info("No ingredients found in recipe");
      return null;
    }

    const normalisedIngredients = ingredients.map((ing) => {
      return {
        amount: ing.amount,
        unit: ing.unit,
        name: ing.name.replace(/^\s*\/\s*/, "").trim(), // Remove leading slash and trim whitespace
      };
    });

    return normalisedIngredients;

    // addToDatabase(recipe, client);
  } else {
    console.info("No recipe found in JSON-LD");
    return null;
  }
}
