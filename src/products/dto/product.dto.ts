import * as z from 'zod';
import { createProductSchema, updateProductSchema } from './product.schema';

export type ICreateProductDTO = z.infer<typeof createProductSchema.body>;
export type IUpdateProductParamsDTO = z.infer<
  typeof updateProductSchema.params
>;
export type IUpdateProductDTO = z.infer<typeof updateProductSchema.body>;
