import express from 'express';
import { validate } from '@infrastructure/middlewares/validators/validate';

import { isLoggedIn } from '@Session/infrastructure/middlewares/isLoggedIn/isLoggedIn';
import UserController from '@Users/infrastructure/controllers/UserController';
import UserValidator from '@Users/infrastructure/validators/UserValidator';

const router = express.Router();

router.get('/', UserController.obtainUser);
router.post(
  '/register',
  UserValidator.createUser,
  validate,
  UserController.createUser
);
router.post('/delete-account', isLoggedIn, UserController.deleteUser);

export default router;
