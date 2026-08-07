import * as z from 'zod';

export const createBrandSchema = {
  body: z.strictObject({
    name: z.string().trim().min(3).max(50),
    slug: z.string().optional(),
    createdBy: z.string(),
    images: z.string().array(),
    rate: z.number().optional(),
    overview: z.string().trim().min(3).max(5000),
  }),
};

export const updateBrandSchema = {
  body: z.strictObject({
    name: z.string().trim().min(3).max(50).optional(),
    description: z.string().trim().min(3).max(500).optional(),
    images: z.string().array().optional(),
    overview: z.string().trim().min(3).max(5000).optional(),
  }),
};
