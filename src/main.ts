import 'module-alias/register';

import server from '@infrastructure/server';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
