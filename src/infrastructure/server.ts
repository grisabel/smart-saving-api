import express from 'express';

const server = express();

server.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

export default server;
