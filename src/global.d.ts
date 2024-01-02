import { Request as ExpressRequest } from 'express';

declare module 'express-serve-static-core' {
  interface User {
    email: string;
  }

  interface Request {
    user?: User;
  }
}
