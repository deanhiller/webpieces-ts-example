import 'reflect-metadata';
import { WebpiecesFactory } from '@webpieces/http-server';
import { ProdServerMeta } from './ProdServerMeta';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

console.log(`[ info  ] Initializing WebPieces Server...`);

// Create and start WebpiecesServer using WebpiecesFactory (0.2.17+ API)
WebpiecesFactory.create(new ProdServerMeta()).then((server) => {
  server.start(port);
  console.log(`[ ready ] http://${host}:${port}`);
  console.log(`[ info  ] Using WebPieces TypeScript Framework`);
  console.log(`[ info  ] Demo credentials: username="demo", password="password123"`);
});
