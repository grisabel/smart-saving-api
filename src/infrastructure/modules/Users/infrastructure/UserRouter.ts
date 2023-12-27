import express from 'express';
import { validate } from '@infrastructure/middlewares/validators/validate';

import UserController from '@Users/infrastructure/controllers/UserController';
import UserValidator from '@Users/infrastructure/validators/UserValidator';

const router = express.Router();

router.get('/', UserController.obtainUser);
router.post('/', UserValidator.createUser, validate, UserController.createUser);
router.post('/delete-account', UserController.deleteUser);

export default router;
