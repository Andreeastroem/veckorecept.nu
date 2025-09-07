import Qty from "js-quantities";

export function convertUnit(
  amount: number,
  fromUnit: string,
): [number, string] {
  const conversions: Record<string, [string, string]> = {
    deciliter: ["dl", "ml"],
    hectogram: ["hg", "g"],
  };

  if (fromUnit in conversions) {
    const [from, to] = conversions[fromUnit];
    const qty = Qty(`${amount} ${from}`);
    const converted = qty.to(to);
    return [converted.scalar, converted.units()];
  }

  return [amount, fromUnit];
}
