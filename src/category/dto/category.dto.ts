import * as z from 'zod';
import { createCategorySchema, updateCategorySchema } from './category.schema';

export type createCategoryDTO = z.infer<typeof createCategorySchema.body>;
export type updateCategoryDTO = z.infer<typeof updateCategorySchema.body>;
