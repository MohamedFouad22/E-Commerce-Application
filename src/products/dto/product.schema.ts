import { Types } from 'mongoose';
import * as z from 'zod';

export const createProductSchema = {
  body: z
    .strictObject({
      name: z.string().trim().min(3).max(25),
      slug: z.string().optional(),
      rate: z.number().optional(),
      overview: z.string(),
      createdBy: z.string().refine((value) => {
        return Types.ObjectId.isValid(value);
      }),
      images: z.string().array(),
      brand: z.string().refine((value) => {
        return Types.ObjectId.isValid(value);
      }),
      category: z.string().refine((value) => {
        return Types.ObjectId.isValid(value);
      }),
      originalPrice: z.number(),
      discountPercentage: z.number().optional().default(0),
      discountPrice: z.number().optional(),
      stock: z.number(),
      soldItems: z.number().default(0),
    })
    .superRefine((data, ctx) => {
      if (data.originalPrice >= 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['originalPrice'],
          message: 'Invalid Price',
        });
      }
    }),
};
