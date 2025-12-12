import { Injectable, inject } from '@angular/core';
import { GeneralApi, WelcomeRequest, WelcomeResponse, HealthRequest, HealthResponse } from 'apis';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private client = inject(GeneralApi);

  async getWelcome(): Promise<WelcomeResponse> {
    const request = new WelcomeRequest();

    // Call auto-generated client method
    // This reads @Get() @Path('/welcome') from decorators
    // Makes: GET http://localhost:3000/welcome
    return this.client.welcome(request);
  }

  async getHealth(): Promise<HealthResponse> {
    const request = new HealthRequest();

    // Call auto-generated client method
    // This reads @Get() @Path('/api/health') from decorators
    // Makes: GET http://localhost:3000/api/health
    return this.client.health(request);
  }
}
