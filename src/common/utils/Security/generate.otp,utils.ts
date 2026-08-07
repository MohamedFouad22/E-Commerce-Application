export const generateOtp = (): string => {
  return String(Math.floor(Math.random() * (979385 - 175932) + 100000));
};
