import { z } from "zod";

export const classroomSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  days: z.array(z.string().min(1)).min(1, "At least one day must be selected"),
});

export type ClassroomFormValues = z.infer<typeof classroomSchema>;
