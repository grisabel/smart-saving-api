import { PrismaClient } from '@prisma/client';
import { fieldEncryptionExtension } from 'prisma-field-encryption';

const client = new PrismaClient();

export const prisma = client.$extends(fieldEncryptionExtension());

export class DDBBConnectionError extends Error {
  static msg: string = 'DDBBConnectionError';

  constructor() {
    super(DDBBConnectionError.msg);
  }
}
