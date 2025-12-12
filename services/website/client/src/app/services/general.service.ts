import { Injectable } from '@angular/core';
import { GeneralApi, WelcomeRequest, WelcomeResponse, HealthRequest, HealthResponse } from 'apis';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private client: GeneralApi) {
    console.log('✅ GeneralService LATEST VERSION constructor called with client:', client);
  }

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
