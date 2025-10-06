import { z } from 'zod';

export const RequestFormSchema = z.object({
  search: z.string().trim().min(1, { message: 'Name must be at least 1 character' }),
  title: z.string().trim().min(1, { message: 'Title must be at least 1 character' }),
  maxResults: z.number().min(0).max(50).optional(),
  order: z.enum(['relevance', 'date', 'rating', 'title', 'videoCount', 'viewCount']).optional(),
});

export type RequestFormType = z.infer<typeof RequestFormSchema>;
