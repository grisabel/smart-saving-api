import express from 'express';
import { validate } from '@infrastructure/middlewares/validators/validate';

import { isLoggedIn } from '@Session/infrastructure/middlewares/isLoggedIn/isLoggedIn';
import UserController from '@Users/infrastructure/controllers/UserController';
import UserValidator from '@Users/infrastructure/validators/UserValidator';

const router = express.Router();

router.post(
  '/register',
  UserValidator.createUser,
  validate,
  UserController.createUser
);

router.post(
  '/reset-password',
  UserValidator.resetPassword,
  validate,
  UserController.resetPassword
);

router.post(
  '/reset-password/:operationId/confirm',
  UserValidator.resetPasswordConfirm,
  validate,
  UserController.resetPasswordConfirm
);

router.get('/info', isLoggedIn, UserController.obtainUserInfo);

router.delete('/account', isLoggedIn, UserController.deleteUser);

router.post(
  '/account/:operationId/confirm',
  UserValidator.deleteAccountConfirm,
  validate,
  isLoggedIn,
  UserController.deleteAccountConfirm
);

export default router;
