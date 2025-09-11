export function intersection<T>(
  TArrayA: T[],
  TArrayB: T[],
  compareFunc: (a: T, b: T) => boolean,
) {
  return TArrayA.filter((ingredientA) =>
    TArrayB.find((ingredientB) => compareFunc(ingredientA, ingredientB)),
  );
}

export function inverseIntersection<T>(
  TArrayA: T[],
  TArrayB: T[],
  compareFunc: (a: T, b: T) => boolean,
) {
  const allValues = [...TArrayA, ...TArrayB];

  const intersectionValues = intersection(TArrayA, TArrayB, compareFunc);

  // all values minus intersectionValues
  return allValues.filter((value) => {
    return !intersectionValues.find((intersectionValue) =>
      compareFunc(value, intersectionValue),
    );
  });
}
