import * as z from 'zod';

export const createCouponSchema = {
  body: z.strictObject({
    code: z.string().trim().uppercase(),
    expiresIn: z.date(),
    discount: z.number().min(1).max(100),
  }),
};
