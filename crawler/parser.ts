import { parseHTML } from "linkedom";
import { z } from "zod";

const recipeSchema = z.object({
  "@type": z.literal("Recipe"),
  cookingMethod: z.string().optional(),
  ingredients: z.union([z.array(z.string()), z.string()]).optional(),
  recipeIngredient: z.union([z.array(z.string()), z.string()]).optional(),
  recipeInstructions: z.optional(
    z.array(
      z.object({
        "@type": z.literal("HowToStep"),
        text: z.string(),
      }),
    ),
  ),
});

export type RecipeType = z.infer<typeof recipeSchema>;

export function getHTMLBody(html: string) {
  const { document } = parseHTML(html);
  const body = document.querySelector("body");

  if (!body) {
    return null;
  }

  // Remove footer tags
  const footerTags = body.querySelectorAll("footer");
  footerTags.forEach((footerTag) => footerTag.remove());

  // Remove header tags
  const headerTags = body.querySelectorAll("header");
  headerTags.forEach((headerTag) => headerTag.remove());

  // Remove all script tags from body
  const scripts = body.querySelectorAll("script");
  scripts.forEach((script) => script.remove());

  // Remove all image tags from body
  const imgTags = body.querySelectorAll("img");
  imgTags.forEach((imgTag) => imgTag.remove());

  // Remove all svg tags from body
  const svgTags = body.querySelectorAll("svg");
  svgTags.forEach((svgTag) => svgTag.remove());

  // Remove figure tags
  const figureTags = body.querySelectorAll("figure");
  figureTags.forEach((figureTag) => figureTag.remove());

  // Remove nav tags
  const navTags = body.querySelectorAll("nav");
  navTags.forEach((navTag) => navTag.remove());

  return body.innerHTML;
}

export function findRecipeJsonLD(html: string) {
  return findRecipeJsonLdTagsAmongstLdTags(html);
}

function findRecipeJsonLdTagsAmongstLdTags(html: string): RecipeType | null {
  const { document } = parseHTML(html);
  const jsonLdTags = document.querySelectorAll(
    'script[type="application/ld+json"]',
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
  json: Record<string, unknown>,
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
