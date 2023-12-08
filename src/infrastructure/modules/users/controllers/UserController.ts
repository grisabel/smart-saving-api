import { Request, Response } from 'express';

const obtainUser = async (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
};

export default {
  obtainUser,
};
