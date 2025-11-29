import 'reflect-metadata';
import express, { Application } from 'express';
import { Container } from 'inversify';
import { HomeController } from './controllers/HomeController';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Create Inversify container
const container = new Container();
container.bind(HomeController).toSelf();

// Create Express app
const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get controller instance from container
const homeController = container.get(HomeController);

// Routes
app.get('/', (req, res) => homeController.index(req, res));
app.get('/health', (req, res) => homeController.health(req, res));
app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello from WebPieces!',
    framework: '@webpieces/http-server',
    version: '0.2.6'
  });
});

// Start server
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
  console.log(`[ info  ] Using WebPieces TypeScript Framework`);
});
