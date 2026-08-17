import { Types } from 'mongoose';
import * as z from 'zod';

export const createCartSchema = {
  body: z.strictObject({
    userId: z.string().refine((value) => {
      Types.ObjectId.isValid(value);
    }),
    productId: z.string().refine((value) => {
      Types.ObjectId.isValid(value);
    }),
    quantity: z.number(),
  }),
};
