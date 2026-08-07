import { compare, hash } from 'bcrypt';

export const hashData = async (
  plaintext: string = '',
  saltRound: number = Number(process.env.saltRound),
) => {
  return await hash(plaintext, saltRound);
};

export const compareData = async (
  plaintext: string = '',
  hash: string = '',
) => {
  return await compare(plaintext, hash);
};
