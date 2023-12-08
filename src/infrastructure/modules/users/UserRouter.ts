import express from 'express';
import UserController from './controllers/UserController';
import UserValidator, { validate } from './validators/UserValidator';

const router = express.Router();

router.get('/', UserController.obtainUser);
router.post('/', UserValidator.createUser, validate, UserController.createUser);

export default router;
