import { parseIngredientLine } from "../nlp-api/parser";

export default function fetchParsedIngredients(ingredients: string[]) {
  return ingredients.map((line) => parseIngredientLine(line));
}
