import { Ingredient, Instruction } from "../types";
import { inverseIntersection } from "./intersection";

describe("inverseIntersection", () => {
  test("finds unique ingredients", () => {
    const arrayA: Ingredient[] = [
      { name: "A", amount: null, unit: null },
      { name: "B", amount: null, unit: null },
      { name: "C", amount: null, unit: null },
    ];
    const arrayB: Ingredient[] = [
      { name: "B", amount: null, unit: null },
      { name: "C", amount: null, unit: null },
      { name: "D", amount: null, unit: null },
    ];

    const uniqueIngredients = inverseIntersection<Ingredient>(
      arrayA,
      arrayB,
      (a, b) => a.name === b.name,
    );

    expect(uniqueIngredients).toHaveLength(2);
    expect(uniqueIngredients).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "A" }),
        expect.objectContaining({ name: "D" }),
      ]),
    );
  });

  test("finds unique instructions", () => {
    const arrayA: Instruction[] = [
      { stepNumber: 1, text: "Do A" },
      { stepNumber: 2, text: "Do C" },
      { stepNumber: 3, text: "Do E" },
    ];
    const arrayB: Instruction[] = [
      { stepNumber: 1, text: "Do B" },
      { stepNumber: 2, text: "Do C" },
      { stepNumber: 3, text: "Do D" },
    ];

    const compareFunc = (a: Instruction, b: Instruction) => {
      return a.stepNumber === b.stepNumber && a.text === b.text;
    };

    const uniqueInstructions = inverseIntersection<Instruction>(
      arrayA,
      arrayB,
      compareFunc,
    );

    expect(uniqueInstructions).toHaveLength(4);
    expect(uniqueInstructions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ stepNumber: 1, text: "Do A" }),
        expect.objectContaining({ stepNumber: 3, text: "Do E" }),
        expect.objectContaining({ stepNumber: 1, text: "Do B" }),
        expect.objectContaining({ stepNumber: 3, text: "Do D" }),
      ]),
    );
  });
});
