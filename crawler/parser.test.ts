import { getHTMLBody } from "./parser";
import { readFileSync } from "fs";

describe("HTML parser", () => {
  it("Get body", () => {
    const htmlComplete = readFileSync(
      "__TESTS__/fixtures/complete.html",
    ).toString();
    const htmlBody = getHTMLBody(htmlComplete);
    expect(htmlBody?.indexOf("<script")).toBe(-1);
  });
});
