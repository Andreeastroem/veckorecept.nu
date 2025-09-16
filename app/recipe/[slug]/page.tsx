import { MainLayout, HeaderLayout } from "@/app/components/PageLayout";
import { api } from "@/convex/_generated/api";
import {} from "@convex-dev/auth/server";
import { fetchQuery } from "convex/nextjs";

type PageProps = { params: Promise<{ slug: string }> };

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = await fetchQuery(api.recipe.getRecipeByLink, { link: slug });
  if (!recipe) {
    console.error("no recipe");
    return null;
  }

  return (
    <>
      <HeaderLayout />
      <MainLayout>
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
      </MainLayout>
    </>
  );
}
