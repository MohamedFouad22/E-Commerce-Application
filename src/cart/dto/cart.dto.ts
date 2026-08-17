import * as z from 'zod';
import { createCartSchema } from './cart.schema';

export type createCartDTO = z.infer<typeof createCartSchema.body>;
