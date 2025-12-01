import { provideSingleton } from '@webpieces/http-routing';
import {
  GeneralApiPrototype,
  WelcomeRequest,
  WelcomeResponse,
  HealthRequest,
  HealthResponse
} from 'apis';

@provideSingleton()
export class HomeController extends GeneralApiPrototype {
  async welcome(request: WelcomeRequest): Promise<WelcomeResponse> {
    const response = new WelcomeResponse();
    response.message = 'Welcome to WebPieces TypeScript Example';
    response.timestamp = new Date().toISOString();
    response.environment = process.env.NODE_ENV || 'development';
    return response;
  }

  async health(request: HealthRequest): Promise<HealthResponse> {
    const response = new HealthResponse();
    response.status = 'healthy';
    response.uptime = process.uptime();
    response.timestamp = new Date().toISOString();
    return response;
  }
}
