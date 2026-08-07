import * as z from 'zod';
import { createBrandSchema, updateBrandSchema } from './brand.schema';

export type createBrandDTO = z.infer<typeof createBrandSchema.body>;
export type updateBrandDTO = z.infer<typeof updateBrandSchema.body>;
