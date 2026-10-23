import { z } from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
export type SignIn = z.infer<typeof signInSchema>;

export const setPasswordSchema = z.object({
  password: z.string().min(8),
});
export type SetPassword = z.infer<typeof setPasswordSchema>;
