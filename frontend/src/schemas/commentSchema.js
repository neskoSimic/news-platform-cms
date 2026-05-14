import { z } from "zod";

export const commentSchema = z.object({
  author: z.string().trim().min(1, "Name is required"),
  text: z.string().trim().min(1, "Comment is required"),
});
