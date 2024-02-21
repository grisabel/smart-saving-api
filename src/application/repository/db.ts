import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export class DDBBConnectionError extends Error {
  static msg: string = 'DDBBConnectionError';

  constructor() {
    super(DDBBConnectionError.msg);
  }
}
