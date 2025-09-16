import { GenericMutationCtx } from "convex/server";
import { DataModel } from "../_generated/dataModel.js";
import { inverseIntersection } from "./intersection";

import { Infer, v } from "convex/values";
import { Ingredient } from "../types.js";

export const addRecipeVArgs = v.object({
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
    instructions: v.optional(
      v.array(
        v.object({
          stepNumber: v.number(),
          text: v.string(),
        }),
      ),
    ),
  }),
});

export type AddRecipeArgs = Infer<typeof addRecipeVArgs>;

export async function upsertIngredients(
  ctx: GenericMutationCtx<DataModel>,
  args: AddRecipeArgs,
) {
  const { recipe } = args;
  const existingIngredients = await ctx.db
    .query("ingredients")
    .filter((q) => q.eq(q.field("recipeLink"), recipe.link))
    .collect();

  if (existingIngredients.length === 0) {
    // Insert new ingredients
    await Promise.all(
      recipe.ingredients.map((ingredient) =>
        ctx.db.insert("ingredients", {
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          recipeLink: recipe.link,
        }),
      ),
    );
    return;
  }

  const uniqueIngredients = inverseIntersection<Ingredient>(
    existingIngredients,
    recipe.ingredients,
    (a, b) => a.name === b.name,
  );

  if (uniqueIngredients.length > 0) {
    // Update database
    // Delete existing ingredients
    await Promise.all(
      existingIngredients.map((ingredient) => ctx.db.delete(ingredient._id)),
    );

    // Insert new ingredients
    await Promise.all(
      recipe.ingredients.map((ingredient) =>
        ctx.db.insert("ingredients", {
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          recipeLink: recipe.link,
        }),
      ),
    );
  }
}

export async function patchInstructions(
  ctx: GenericMutationCtx<DataModel>,
  args: AddRecipeArgs,
) {
  const { recipe } = args;

  const existingInstructions = await ctx.db
    .query("recipeInstructions")
    .filter((q) => q.eq(q.field("recipeLink"), recipe.link))
    .collect();

  if (existingInstructions.length > 0) {
    //remove existing instructions
    await Promise.all(
      existingInstructions.map((instruction) => ctx.db.delete(instruction._id)),
    );
  }

  // Insert new instructions
  await Promise.all(
    (recipe.instructions ?? []).map(async (instruction) => {
      await ctx.db.insert("recipeInstructions", {
        recipeLink: recipe.link,
        text: instruction.text,
        stepNumber: instruction.stepNumber,
      });
    }),
  );
}

export async function upsertRecipe(
  ctx: GenericMutationCtx<DataModel>,
  args: AddRecipeArgs,
) {
  const { recipe } = args;

  // Upsert ingredients
  await upsertIngredients(ctx, args);

  // Upsert instructions
  await patchInstructions(ctx, args);

  // Upsert recipe
  await ctx.db.patch(recipe.id, {
    link: recipe.link,
    name: recipe.name,
    isCrawled: true,
  });
}
