import * as z from 'zod';
import { createCouponSchema } from './coupon.schema';

export type createCouponDTO = z.infer<typeof createCouponSchema.body>;
