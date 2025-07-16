import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  parentPhone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone is too long"),
  email: z.string().email("Invalid email address"),
  monthlyFee: z
    .number({ invalid_type_error: "Fee must be a number" })
    .positive("Fee must be positive"),
});

export type StudentFormValues = z.infer<typeof studentSchema>;