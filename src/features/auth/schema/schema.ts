import { z } from 'zod';

const genderOptions = ['male', 'female'] as const;

export const AuthSchema = z.object({
  username: z.string().trim().min(3, { message: 'Name must be at least 3 characters' }),
  password: z.string().trim().min(3, { message: 'Password must be at least 3 characters' }),
  email: z
    .string()
    .trim()
    .pipe(z.email({ message: 'Wrong email' })),
  age: z.number().int().min(13, { message: 'You must be at least 13 years old' }),
  gender: z.enum(genderOptions, { message: 'Please select a gender' }),
});

export type AuthSchemaType = z.infer<typeof AuthSchema>;
