// modernCrawler.ts
import { findRecipeJsonLD, getHTMLBody, RecipeType } from "./parser.js";
import fetchParsedIngredients from "./ingredient-parser.js";
import { api, internal } from "../convex/_generated/api.js";
import { GenericActionCtx } from "convex/server";
import { DataModel, Id } from "../convex/_generated/dataModel.js";
import { crawlRecipeFromHTMLBody } from "./openai";
import { Ingredient, Instruction } from "../convex/types.js";

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
      console.error("Unable to crawl recipe:", recipe.reason);
      return null;
    })
    .filter((recipe) => recipe !== null);

  const recipesAddedToDatabase = await Promise.allSettled(
    validRecipes.map(async (recipe) => {
      if (recipe) {
        const ingredients = recipe.ingredients;
        const instructions = recipe.instructions;

        if (ingredients && instructions) {
          await ctx.runMutation(internal.recipe.addRecipeToDatabase, {
            recipe: {
              name: recipe.name,
              link: recipe.link,
              id: recipe.id,
              ingredients,
              instructions,
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

    const jsonLd = findRecipeJsonLD(html);

    let ingredients: Ingredient[] | null = null;
    let instructions: Instruction[] | null = null;

    if (jsonLd !== null) {
      ingredients = await getIngredientsFromHTML(jsonLd);
      instructions = getInstructionsFromHTML(jsonLd);
    }
    // Depending on what is missing we run different actions to retrieve data
    // from a llm parsing the html
    const htmlBody = getHTMLBody(html);

    if (htmlBody && htmlBody.length !== 0) {
      if (!ingredients && !instructions) {
        // Crawl for both ingredients and instructions
        console.info("Crawling using open AI - full recipe");
        const AICrawledRecipe = await crawlRecipeFromHTMLBody(htmlBody);

        ingredients = AICrawledRecipe.ingredients;
        instructions = AICrawledRecipe.instructions;
      } else if (!ingredients) {
        console.info("Crawling using open AI - only ingredients");
        // Crawl for ingredients only
        return null;
      } else if (!instructions) {
        console.info("Crawling using open AI - only instructions");
        // Crawl for instructions only
        return null;
      }
    }

    if (!ingredients && !instructions) {
      return null;
    }

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
    console.error("No ingredients found in recipe");
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
  const instructions = recipeJsonLd.recipeInstructions ?? null;

  if (!instructions) {
    console.error("No instructions found in recipe");
    return null;
  }

  return instructions.map((step, idx) => {
    return {
      text: step.text,
      stepNumber: idx + 1,
    };
  });
}
