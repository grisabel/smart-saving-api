import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { ServerRoutes } from './ServerRoutes';
import errorHandler from './middlewares/validators/error/errorHandler';
import UserRouter from './modules/Users/infrastructure/UserRouter';
import SessionRouter from './modules/Session/infrastructure/SessionRouter';
import FinancialControlRouter from './modules/FinancialControl/infrastructure/FinancialControlRouter';
import MarketingRouter from './modules/Marketing/infrastructure/MarketingRouter';

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
server.use(ServerRoutes.financialControl, FinancialControlRouter);
server.use(ServerRoutes.marketing, MarketingRouter);

server.use(errorHandler);

export default server;
