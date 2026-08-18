import * as z from 'zod';
import { createOrderSchema } from './order.schema';

export type createOrderDTO = z.infer<typeof createOrderSchema.body>;
