import * as z from 'zod';
import { createCartSchema, updateCartSchema } from './cart.schema';

export type createCartDTO = z.infer<typeof createCartSchema.body>;
export type updateProductDTO = z.infer<typeof updateCartSchema.body>;
export type updateProductParamDTO = z.infer<typeof updateCartSchema.param>;
