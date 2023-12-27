import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { ServerRoutes } from './ServerRoutes';
import UserRouter from './modules/Users/infrastructure/UserRouter';
import SessionRouter from './modules/Session/infrastructure/SessionRouter';

const server: Express = express();

//TODO move to environment
server.use(
  cors({
    origin: '*',
    methods: ['OPTIONS', 'GET', 'PUT', 'POST', 'DELETE'],
  })
);
server.use(bodyParser.json());

server.get('/status', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

server.use(ServerRoutes.session, SessionRouter);
server.use(ServerRoutes.user, UserRouter);

export default server;
