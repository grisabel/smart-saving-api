import { Request, Response } from 'express';
import { PostUserDTO } from '../dtos/request/PostUserDTO';

const obtainUser = async (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
};

const createUser = async (req: Request<PostUserDTO>, res: Response) => {
  const body = req.body;
  res.status(200).json({ status: 'OK' });
};

export default {
  obtainUser,
  createUser,
};
