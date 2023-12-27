import express from 'express';
import { validate } from '@infrastructure/validators/Validate';

import UserController from './controllers/SessionController';
import SessionValidator from './validators/SessionValidator';

const router = express.Router();

router.post(
  '/login',
  SessionValidator.loginUser,
  validate,
  UserController.loginUser
);
router.post(
  '/refreshToken',
  SessionValidator.refreshTokenBody,
  validate,
  UserController.refreshToken
);

router.delete(
  '/refreshToken/:refreshToken?',
  SessionValidator.refreshTokenUrl,
  validate,
  UserController.deleteRefreshToken
);

export default router;
