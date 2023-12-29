import { v4 as uuidv4 } from 'uuid';

function generateId(): string {
  return uuidv4();
}

function isValid(id: string): boolean {
  const regexPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return regexPattern.test(id);
}

export default {
  generateId,
  isValid,
};
