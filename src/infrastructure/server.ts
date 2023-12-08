import express from 'express';
import cors from 'cors';

const server = express();

server.use(
  cors({
    origin: '*',
    methods: ['OPTIONS', 'GET', 'PUT', 'POST'],
  })
);

server.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

export default server;
