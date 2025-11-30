import 'reflect-metadata';
import { WebpiecesServer } from '@webpieces/http-server';
import { ProdServerMeta } from './ProdServerMeta';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

console.log(`[ info  ] Initializing WebPieces Server...`);

// Create and start WebpiecesServer
const server = new WebpiecesServer(new ProdServerMeta());
server.start(port);

console.log(`[ ready ] http://${host}:${port}`);
console.log(`[ info  ] Using WebPieces TypeScript Framework`);
console.log(`[ info  ] Demo credentials: username="demo", password="password123"`);
