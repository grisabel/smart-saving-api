import express from 'express';
import { validate } from '@infrastructure/middlewares/validators/validate';

import UserController from '@Session/infrastructure/controllers/SessionController';
import SessionValidator from '@Session/infrastructure/validators/SessionValidator';

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
