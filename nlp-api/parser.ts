import { DataModel } from "../convex/_generated/dataModel";

export function parseIngredientLine(
  line: string,
): Pick<DataModel["ingredients"]["document"], "amount" | "unit" | "name"> {
  const parts = line.toLowerCase().split(" ");
  let currentIndex = 0;
  let amount: number[] | null = null;
  let unit: string | null = null;

  // Parse amount
  if (/^[0-9½¼¾]+(?:\/[0-9]+)?$/.test(parts[currentIndex])) {
    amount = [parseFraction(parts[currentIndex])];
    currentIndex++;

    // Check for range (e.g., "3 or 4")
    if (
      parts[currentIndex] === "or" &&
      /^[0-9]+$/.test(parts[currentIndex + 1])
    ) {
      amount.push(parseInt(parts[currentIndex + 1]));
      currentIndex += 2;
    }
  } else if (parts[0] === "some") {
    amount = null;
    currentIndex++;
  }

  // Parse unit
  if (currentIndex < parts.length) {
    const possibleUnit = parts[currentIndex];
    const normalizedUnit = normalizeUnit(possibleUnit);
    if (normalizedUnit) {
      unit = normalizedUnit;
      currentIndex++;
    }
  }

  // The rest is the ingredient
  const name = parts.slice(currentIndex).join(" ");

  return { amount, unit, name };
}

function parseFraction(str: string): number {
  if (str === "½") return 0.5;
  if (str === "¼") return 0.25;
  if (str === "¾") return 0.75;

  if (str.includes("/")) {
    const [num, denom] = str.split("/").map(Number);
    return num / denom;
  }
  return parseFloat(str);
}

function normalizeUnit(unit: string): string | null {
  const unitMap: Record<string, string> = {
    tbsp: "tablespoon",
    tsp: "teaspoon",
    cup: "cup",
    dl: "deciliter",
    hg: "hectogram",
    tsk: "teaspoon",
    msk: "tablespoon",
  };

  return unitMap[unit] || null;
}
