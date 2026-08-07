import z from 'zod';
import {
  genderEnum,
  providerEnum,
  RoleEnum,
} from '../../common/enums/user.eums';

export const loginSchema = {
  body: z.strictObject({
    email: z.email(),
    password: z.string().min(8),
  }),
};

export const createUserSchema = {
  body: z
    .strictObject({
      firstName: z.string().min(2).max(25).trim().lowercase(),
      lastName: z.string().min(2).max(25).trim().lowercase(),
      email: z.email(),
      password: z.string().min(8),
      confirmPassword: z.string(),
      age: z.number(),
      phone: z.string().optional(),
      gender: z.enum(genderEnum).default(genderEnum.MALE).optional(),
      role: z.enum(RoleEnum).default(RoleEnum.USER).optional(),
      provider: z.enum(providerEnum).default(providerEnum.SYSTEM).optional(),
    })
    .superRefine((value, ctx) => {
      if (value.password !== value.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          path: ['confirPassword'],
          message: 'Password Not Match 🚫',
        });
      }
    }),
};

export const resendOTPSchema = {
  body: z.strictObject({
    email: z.email(),
  }),
};

export const confirmEmailSchema = {
  body: z.strictObject({
    email: z.email(),
    otp: z.string(),
  }),
};
