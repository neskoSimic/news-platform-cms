import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().min(1, "Title is required"),

  category_id: z.string().min(1, "Category is required"),

  text: z.string().min(1, "Text is required"),

  tags: z.string().optional(),
});
