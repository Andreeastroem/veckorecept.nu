import { parseIngredientLine } from "../parser";
import { convertUnit } from "../conversion";

describe("ingredient parser", () => {
  test("parse simple line", () => {
    const result = parseIngredientLine("1 egg");
    expect(result.amount).toEqual([1]);
    expect(result.unit).toBeNull();
    expect(result.name).toContain("egg");
  });

  test("parse with unit", () => {
    const result = parseIngredientLine("2 tbsp olive oil");
    expect(result.amount).toEqual([2]);
    expect(result.unit).toBe("tablespoon");
    expect(result.name).toContain("olive oil");
  });

  test("parse fraction", () => {
    const result = parseIngredientLine("3/4 cup sugar");
    expect(result.amount).toEqual([0.75]);
    expect(result.unit).toBe("cup");
  });

  test("parse range", () => {
    const result = parseIngredientLine("3 or 4 bananas");
    expect(result.amount).toEqual([3, 4]);
    expect(result.unit).toBeNull();
    expect(result.name).toContain("bananas");
  });

  test("parse unstructured", () => {
    const result = parseIngredientLine("some flour");
    expect(result.amount).toBeNull();
    expect(result.name).toContain("flour");
  });

  test("swedish tesked", () => {
    const result = parseIngredientLine("2 tsk vaniljsocker");
    expect(result.amount).toEqual([2]);
    expect(result.unit).toBe("teaspoon");
    expect(result.name).toContain("vaniljsocker");
  });
});

describe("unit conversion", () => {
  test("convert deciliter to ml", () => {
    const [amount, unit] = convertUnit(2, "deciliter");
    expect(amount).toBe(200);
    expect(unit).toBe("ml");
  });

  test("convert hectogram to gram", () => {
    const [amount, unit] = convertUnit(1.5, "hectogram");
    expect(amount).toBe(150);
    expect(unit).toBe("g");
  });
});
