import express from 'express';
import cors from 'cors';
import { ServerRoutes } from './ServerRoutes';
import UserRouter from './modules/users/UserRouter';

const server = express();

//TODO move to environment
server.use(
  cors({
    origin: '*',
    methods: ['OPTIONS', 'GET', 'PUT', 'POST'],
  })
);

server.get('/status', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

server.use(ServerRoutes.user, UserRouter);

export default server;
