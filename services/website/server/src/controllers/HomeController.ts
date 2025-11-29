import { injectable } from 'inversify';
import { Request, Response } from 'express';
import { WelcomeResponse, HealthResponse } from 'apis';

@injectable()
export class HomeController {
  async index(req: Request, res: Response): Promise<void> {
    const response: WelcomeResponse = {
      message: 'Welcome to WebPieces TypeScript Example',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
    res.json(response);
  }

  async health(req: Request, res: Response): Promise<void> {
    const response: HealthResponse = {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  }
}
