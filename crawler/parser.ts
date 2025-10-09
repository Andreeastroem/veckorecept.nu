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

  // Tags to remove completely
  const removeSelectors = [
    "footer",
    "header",
    "script",
    "img",
    "svg",
    "figure",
    "nav",
    "style", // remove embedded styles
    "noscript", // useless content
  ];

  removeSelectors.forEach((selector) => {
    body.querySelectorAll(selector).forEach((el) => el.remove());
  });

  body.querySelectorAll("*").forEach((el) => {
    for (const attr of el.getAttributeNames()) {
      el.removeAttribute(attr);
    }
  });

  const noisySelectors = [
    "[class*='share']",
    "[class*='comment']",
    "[class*='related']",
    "[id*='share']",
    "[id*='comment']",
    "[id*='related']",
    "aside",
    "form",
    "button",
  ];
  noisySelectors.forEach((selector) => {
    body.querySelectorAll(selector).forEach((el) => el.remove());
  });

  return body.innerHTML
    .replace(/\s+/g, " ") // collapse extra spaces
    .replace(/>\s+</g, "><") // remove whitespace between tags
    .trim();
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
