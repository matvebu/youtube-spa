import { z } from 'zod';

export const GenderOptionsType = ['male', 'female'] as const;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

export const AuthSchema = z.object({
  username: z.string().trim().min(3, { message: 'Name must be at least 3 characters' }),
  password: z
    .string({ error: 'Required field' })
    .trim()
    .min(8, { message: 'At least 8 characters needed' })
    .regex(passwordRegex, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., !@#$%)',
    }),
  email: z
    .string()
    .trim()
    .pipe(z.email({ message: 'Wrong email' })),
  age: z.number().int().min(18, { message: 'You must be at least 18 years old' }),
  gender: z.enum(GenderOptionsType, { message: 'Please select a gender' }),
});

export type AuthSchemaType = z.infer<typeof AuthSchema>;
