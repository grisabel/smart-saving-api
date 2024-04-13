import express from 'express';
import { validate } from '@infrastructure/middlewares/validators/validate';

import UserController from '@Users/infrastructure/controllers/UserController';
import UserValidator from '@Users/infrastructure/validators/UserValidator';

const router = express.Router();

router.get(
  '/info',
  UserValidator.createUser,
  validate,
  UserController.obtainUserInfo
);

export default router;
