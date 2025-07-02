import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
