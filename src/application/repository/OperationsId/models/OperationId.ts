export enum OperationType {
  RESET_PASSWORD = 'RESET_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
}
export interface Operation {
  email: string;
  id: string;
  type: OperationType;
  expiresIn: number;
}
