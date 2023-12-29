export enum OperationType {
  RESET_PASSWORD = 'reset-password',
  DELETE_ACCOUNT = 'delete-account',
}
export interface Operation {
  email: string;
  id: string;
  type: OperationType;
  expiresIn: number;
}
