import * as z from 'zod';
import { createProductSchema } from './product.schema';

export type ICreateProductDTO = z.infer<typeof createProductSchema.body>;
