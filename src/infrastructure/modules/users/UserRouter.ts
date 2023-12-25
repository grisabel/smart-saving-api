import express from 'express';
import { validate } from '@infrastructure/validators/Validate';

import UserController from './controllers/UserController';
import UserValidator from './validators/UserValidator';

const router = express.Router();

router.get('/', UserController.obtainUser);
router.post('/', UserValidator.createUser, validate, UserController.createUser);
router.post(
  '/login',
  UserValidator.loginUser,
  validate,
  UserController.loginUser
);
router.post(
  '/refreshToken',
  UserValidator.refreshToken,
  validate,
  UserController.refreshToken
);

export default router;
