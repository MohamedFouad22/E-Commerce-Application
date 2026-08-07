import {
  JwtPayload,
  Secret,
  sign,
  SignOptions,
  verify,
  VerifyOptions,
} from 'jsonwebtoken';

export const generateToken = async ({
  payload,
  secretKey = process.env.USER_ACCESS_TOKEN_SECRET_KEY as Secret,
  options,
}: {
  payload: string | Buffer | object;
  secretKey: Secret;
  options: SignOptions;
}): Promise<string> => {
  return sign(payload, secretKey, options);
};

export const verifyToken = async ({
  token,
  secretKey = process.env.USER_TOKEN_SECRET_KEY as Secret,
  options,
}: {
  token: string;
  secretKey: Secret;
  options: VerifyOptions;
}): Promise<JwtPayload> => {
  return verify(token, secretKey, options) as JwtPayload;
};
