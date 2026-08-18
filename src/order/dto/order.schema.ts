import { Types } from 'mongoose';
import * as z from 'zod';

export const createOrderSchema = {
  body: z.strictObject({
    address: z.string(),
    phone: z.string(),
    cartId: z.string().refine((value) => {
      Types.ObjectId.isValid(value);
    }),
  }),
};
