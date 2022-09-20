import { randomBytes } from 'crypto';

export const generateRandomCode = (): string => {
  return randomBytes(3).toString('hex');
};
