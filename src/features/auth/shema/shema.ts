import { z } from 'zod';
export const authSchema = z.object({
  name: z.string().min(1, 'Required'),
  age: z.number().int().min(18, '18+'),
});
export type UserForm = z.infer<typeof authSchema>;
