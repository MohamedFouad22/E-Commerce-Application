import * as z from 'zod';
import { confirmEmailSchema, createUserSchema, loginSchema, resendOTPSchema } from './auth.schema.dto';

export type createUserDTO = z.infer<typeof createUserSchema.body>;
export type loginSchemaDTO = z.infer<typeof loginSchema.body>;
export type resendOTPDTO = z.infer<typeof resendOTPSchema.body>;
export type confirmEmailDTO = z.infer<typeof confirmEmailSchema.body>;
