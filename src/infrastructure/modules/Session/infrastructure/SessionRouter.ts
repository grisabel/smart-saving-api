import express from 'express';
import { validate } from '@infrastructure/middlewares/validators/validate';

import UserController from '@Session/infrastructure/controllers/SessionController';
import SessionValidator from '@Session/infrastructure/validators/SessionValidator';
import { isLoggedIn } from './middlewares/isLoggedIn/isLoggedIn';

const router = express.Router();

router.post(
  '/login',
  SessionValidator.loginUser,
  validate,
  UserController.loginUser
);
router.post(
  '/token',
  SessionValidator.refreshTokenBody,
  validate,
  UserController.refreshToken
);

router.post(
  '/logout',
  isLoggedIn,
  SessionValidator.refreshTokenBody,
  validate,
  UserController.logout
);

router.post(
  '/revoke',
  SessionValidator.accesTokenBody,
  isLoggedIn,
  validate,
  UserController.revokeAccessToken
);

export default router;
