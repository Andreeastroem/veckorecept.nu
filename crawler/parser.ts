import { parseHTML } from "linkedom";
import { z } from "zod";

const recipeSchema = z.object({
  "@type": z.literal("Recipe"),
  cookingMethod: z.string().optional(),
  ingredients: z.union([z.array(z.string()), z.string()]).optional(),
  recipeIngredient: z.union([z.array(z.string()), z.string()]).optional(),
});

type RecipeType = z.infer<typeof recipeSchema>;

export function findRecipeJsonLD(html: string) {
  return findRecipeJsonLdTagsAmongstLdTags(html);
}

function findRecipeJsonLdTagsAmongstLdTags(html: string): RecipeType | null {
  const { document } = parseHTML(html);
  const jsonLdTags = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );

  let recipeJsonLd: null | Record<string, unknown> = null;

  const jsonLdTagsArray = Array.from(jsonLdTags);

  for (const tag of jsonLdTagsArray) {
    const textContent = tag.textContent;

    if (!textContent) {
      continue;
    }

    try {
      const json = JSON.parse(textContent);

      if (json["@graph"]) {
        recipeJsonLd = exportRecipeJsonFromGraphStructure(json);
      } else {
        recipeJsonLd = exportRecipeFromJsonLd(json);
      }

      if (recipeJsonLd) {
        break;
      }
    } catch (error) {
      console.error("Error parsing JSON-LD", error);
    }
  }

  if (!recipeJsonLd) {
    return null;
  }

  const jsonLd = recipeSchema.safeParse(recipeJsonLd);

  return jsonLd.success ? jsonLd.data : null;
}

function exportRecipeJsonFromGraphStructure(
  json: Record<string, unknown>
): Record<string, unknown> | null {
  if (Array.isArray(json["@graph"])) {
    const recipe = json["@graph"].find((item: Record<string, unknown>) => {
      if (item["@type"] === "Recipe") {
        return true;
      }
      return false;
    });

    if (recipe === undefined) {
      return null;
    }

    return recipe;
  }

  return null;
}

function exportRecipeFromJsonLd(json: Record<string, unknown>) {
  if (json["@type"] === "Recipe") {
    return json;
  }

  return null;
}

function validateRecipeJsonLd(recipeJsonLd: Record<string, unknown>): boolean {
  const result = recipeSchema.safeParse(recipeJsonLd);
  if (!result.success) {
    console.error("Invalid Recipe JSON-LD", result.error);
    return false;
  }
  return true;
}
