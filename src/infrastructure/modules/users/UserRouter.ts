import express from 'express';
import { validate } from '../../../infrastructure/validators/Validate';

import UserController from './controllers/UserController';
import UserValidator from './validators/UserValidator';

const router = express.Router();

router.get('/', UserController.obtainUser);
router.post('/', UserValidator.createUser, validate, UserController.createUser);

export default router;
