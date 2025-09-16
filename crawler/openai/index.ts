import OpenAI from "openai";
import { z } from "zod";
import { IngredientSchema, InstructionSchema } from "../../convex/types";

const client = new OpenAI();

const recipeSchema = z.object({
  ingredients: z.array(IngredientSchema),
  instructions: z.array(InstructionSchema),
});

export async function crawlRecipeFromHTMLBody(htmlBody: string) {
  const prompt = `Extract the ingredients and instructions from the following HTML body. 
    The shape of the response should be as follows (described as a typescript type):
    {
      "ingredients": Array<{
        amount: number[] | null
        unit: string | null
        name: string
      }>,
      "instructions": Array<{
        stepNumber: number
        text: string
      }>
    }
  
    There are some caveats to the ingredients amount field:
    - If the amount is a range, e.g. "2-3", it should be represented as an array of numbers, e.g. [2, 3]
    - If the amount is a fraction, e.g. "1/2", it should be represented as an array of numbers, e.g. [0.5]
    - If the amount is a mixed number, e.g. "1 1/2", it should be represented as an array of numbers, e.g. [1.5]
    - If the amount is in multiple parts, e.g. "2-3 or 4", it should be represented as an array of numbers, e.g. [2, 3, 4]
    - If the amount is not specified or cannot be determined, it should be null
    - If the amount is a word, e.g. "a few", it should be null

    Regarding the instructions field:
    - There is not always a number to the instruction, it should be inferred from the context at what stage we are currently are
    - I do not want the text to be altered, it should be copied as is. The whole step text should be unaltered.
    - If there are several ways to approach the process (for example oven or fryer) choose one - preferably the recommended one. If there is no recommended use the most accessible

    This is the html body: ${htmlBody}
  `;

  const response = await client.responses.create({
    model: "gpt-5-nano",
    input: prompt,
  });

  const responseData = JSON.parse(response.output_text);

  const validation = recipeSchema.safeParse(responseData);
  if (!validation.success) {
    throw Error(`Unable to parse the output: ${response.output_text}`);
  }

  if (!validation.data) {
    throw Error("No data in validation");
  }

  return validation.data;
}
