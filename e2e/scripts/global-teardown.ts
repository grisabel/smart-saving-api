import server from '../../src/infrastructure/server';

/* eslint-disable */

module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.

  const server = globalThis.__server__;

  server.close(() => {
    console.log('Servidor cerrado');
  });

  console.log(globalThis.__TEARDOWN_MESSAGE__);
};
