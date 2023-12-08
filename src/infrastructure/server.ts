import express from 'express';
import cors from 'cors';

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

export default server;
