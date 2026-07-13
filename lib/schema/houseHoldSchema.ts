import { z } from "zod";

export const houseHoldSchema = (type: "create" | "update") => {
  const base = {
    name: z
      .string({ error: "Name is required." })
      .trim()
      .min(1, "Name is required."),

    relation: z
      .string({ error: "Relation is required." })
      .trim()
      .min(1, "Relation is required."),

    age: z
      .number({ error: "Age is required." })
      .int("Age must be a whole number.")
      .min(0, "Age cannot be negative.")
      .max(150, "Please enter a valid age."),
  };

  if (type === "update") {
    return z.object({
      name: base.name.optional(),
      relation: base.relation.optional(),
      age: base.age.optional(),
    });
  }

  return z.object(base);
};

export type HouseHoldInput = z.infer<ReturnType<typeof houseHoldSchema>>;