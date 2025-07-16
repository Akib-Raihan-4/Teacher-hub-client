// paymentSchema (inside CreatePaymentFormModal.helpers.ts)
import { z } from "zod";

export const paymentSchema = z.object({
  amount: z.number().min(1, "Amount is required"),
  forMonth: z.date({ required_error: "Month is required" }),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
