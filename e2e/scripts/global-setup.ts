import 'tsconfig-paths/register';

import app from '../../src/infrastructure/server';
import { prisma } from '../../src/application/repository/db';

function startServer() {
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;

  return new Promise(async (resolve, reject) => {
    await prisma.user.deleteMany();
    await prisma.operation.deleteMany();

    const server = app.listen(port, host, () => {
      console.log(`[ ready ] http://${host}:${port}`);
      resolve(server);
    });

    server.on('error', reject);
  });
}

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  const server = await startServer();
  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__server__ = server;
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};
