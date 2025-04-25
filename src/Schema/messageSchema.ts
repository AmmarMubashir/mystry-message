import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Message content must contain atleast 10 characters")
    .max(300, "Message content must not exceed 300 characters"),
});
