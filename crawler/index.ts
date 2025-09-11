// modernCrawler.ts
import { findRecipeJsonLD, RecipeType } from "./parser.js";
import fetchParsedIngredients from "./ingredient-parser.js";
import { api, internal } from "../convex/_generated/api.js";
import { GenericActionCtx } from "convex/server";
import { DataModel, Id } from "../convex/_generated/dataModel.js";

export async function crawlRecipes(ctx: GenericActionCtx<DataModel>) {
  const recipesToCrawl = (
    await ctx.runQuery(api.recipe.getAllUncrawledRecipes)
  ).filter((uncrawledRecipes) => uncrawledRecipes !== null);

  const pendingCrawls = recipesToCrawl.map(async (recipe) => {
    return await crawlRecipeFromUrl(
      recipe.link,
      recipe.name,
      recipe.link,
      recipe.user,
      recipe._id,
    );
  });

  const recipes = await Promise.allSettled(pendingCrawls);

  const validRecipes = recipes
    .map((recipe) => {
      if (recipe.status === "fulfilled") {
        return recipe.value;
      }
      console.info("Unable to crawl recipe:", recipe.reason);
      return null;
    })
    .filter((recipe) => recipe !== null);

  const recipesAddedToDatabase = await Promise.allSettled(
    validRecipes.map(async (recipe) => {
      if (recipe) {
        const ingredients = recipe.ingredients;
        if (ingredients) {
          await ctx.runMutation(internal.recipe.addRecipeToDatabase, {
            recipe: {
              name: recipe.name,
              link: recipe.link,
              id: recipe.id,
              ingredients,
              instructions: recipe.instructions,
            },
          });
        }
      }
    }),
  );

  if (recipesAddedToDatabase.some((failed) => failed.status === "rejected")) {
    console.error("Some recipes failed to add to the database");
  }
}

async function crawlRecipeFromUrl(
  url: string,
  name: string,
  link: string,
  user: string,
  id: Id<"recipes">,
) {
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
      console.error(`No recipe JSON-LD found in ${url}`);
    }

    const jsonLd = findRecipeJsonLD(html);
    if (!jsonLd) {
      console.error(`No recipe found in JSON-LD for ${url}`);
      return null;
    }

    const ingredients = await getIngredientsFromHTML(jsonLd);
    const instructions = getInstructionsFromHTML(jsonLd);

    return {
      ingredients,
      instructions,
      name: name,
      link: link,
      user: user,
      id: id,
    };
  } catch (err) {
    console.error(`Failed to fetch ${url}`, err);
    return null;
  }
}

async function getIngredientsFromHTML(recipeJsonLd: RecipeType) {
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
}

function getInstructionsFromHTML(recipeJsonLd: RecipeType) {
  const instructions = recipeJsonLd.recipeInstructions ?? [];
  return instructions.map((step, idx) => {
    return {
      text: step.text,
      stepNumber: idx + 1,
    };
  });
}
