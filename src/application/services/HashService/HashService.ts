import crypto from 'crypto';

function generateHash(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export default {
  generateHash,
};
