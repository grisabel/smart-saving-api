import express from 'express';
import UserController from './controllers/UserController';

const router = express.Router();

router.get('/', UserController.obtainUser);

export default router;
