import { Types } from 'mongoose';
import * as z from 'zod';

export const createCategorySchema = {
  body: z.strictObject({
    name: z.string().min(3).max(50).trim(),
    slug: z.string().optional(),
    discription: z.string().min(3).max(5000).trim(),
    createdBy: z.string(),
    images: z.string().array(),
    brands: z.array(
      z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      }),
    ),
  }),
};

export const updateCategorySchema = {
  body: z.strictObject({
    name: z.string().min(3).max(50).trim().optional(),
    discription: z.string().min(3).max(5000).trim().optional(),
    createdBy: z.string().optional(),
    images: z.string().array().optional(),
    brands: z.string().array().optional(),
  }),
};
