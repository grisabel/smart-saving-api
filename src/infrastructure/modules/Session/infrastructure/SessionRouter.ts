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
  '/token',
  SessionValidator.refreshTokenBody,
  validate,
  UserController.refreshToken
);

router.post(
  '/logout',
  SessionValidator.refreshTokenBody,
  validate,
  UserController.deleteRefreshToken
);

router.post(
  '/revoke',
  SessionValidator.accesTokenBody,
  validate,
  UserController.revokeAccessToken
);

export default router;
