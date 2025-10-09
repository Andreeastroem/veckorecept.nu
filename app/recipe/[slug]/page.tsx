import { MainLayout, HeaderLayout } from "@/app/components/PageLayout";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Link from "next/link";
import { Fragment } from "react";

type PageProps = { params: Promise<{ slug: string }> };

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipes = await fetchQuery(api.recipe.getRecipeBySlug, { slug });
  if (!recipes) {
    console.error("no recipe");
    return null;
  }

  return (
    <>
      <HeaderLayout />
      <MainLayout>
        {recipes.length === 1 ? (
          <SingleRecipe recipes={recipes} />
        ) : (
          <MultipleRecipes recipes={recipes} />
        )}
      </MainLayout>
    </>
  );
}

function SingleRecipe({
  recipes,
}: {
  recipes: typeof api.recipe.getRecipeBySlug._returnType;
}) {
  if (!recipes) {
    return null;
  }

  const recipe = recipes[0];

  return (
    <>
      <h1>{recipe.name}</h1>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient._id} className="flex gap-2">
            <span>{ingredient.name}</span>
            <div className="flex gap-1">
              <span>{ingredient.amount}</span>
              <span>{ingredient.unit}</span>
            </div>
          </li>
        ))}
      </ul>
      <ul>
        {recipe.instructions
          .sort((a, b) => a.stepNumber - b.stepNumber)
          .map((instruction) => (
            <li key={instruction.stepNumber}>{instruction.text}</li>
          ))}
      </ul>
    </>
  );
}

function MultipleRecipes({
  recipes,
}: {
  recipes: typeof api.recipe.getRecipeBySlug._returnType;
}) {
  if (!recipes) return null;

  const originalRecipeLink = recipes.at(0)?.recipeLink;

  console.info(originalRecipeLink);

  return (
    <>
      <h1>Recept</h1>
      {originalRecipeLink !== undefined ? (
        <>
          <p>
            <span>Recept hämtade från </span>
            <Link
              className="text-blue-500 hover:text-blue-700 hover:underline"
              href={originalRecipeLink}
            >
              {originalRecipeLink}
            </Link>
          </p>
        </>
      ) : null}

      {recipes.map((recipe) => {
        return (
          <Fragment key={recipe._id}>
            <h2>{recipe.name}</h2>
            <ul>
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient._id} className="flex gap-2">
                  <span>{ingredient.name}</span>
                  <div className="flex gap-1">
                    <span>{ingredient.amount}</span>
                    <span>{ingredient.unit}</span>
                  </div>
                </li>
              ))}
            </ul>
            <ul>
              {recipe.instructions
                .sort((a, b) => a.stepNumber - b.stepNumber)
                .map((instruction) => (
                  <li key={instruction.stepNumber}>{instruction.text}</li>
                ))}
            </ul>
          </Fragment>
        );
      })}
    </>
  );
}
