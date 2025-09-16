import { z } from "zod";

export const IngredientSchema = z.object({
  amount: z.array(z.number()).nullable(),
  unit: z.string().nullable(),
  name: z.string(),
});
export const InstructionSchema = z.object({
  stepNumber: z.number(),
  text: z.string(),
});

export type Ingredient = z.infer<typeof IngredientSchema>;

export type Instruction = z.infer<typeof InstructionSchema>;
