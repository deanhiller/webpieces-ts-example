import { Injectable } from '@angular/core';
import { GeneralApi, WelcomeRequest, WelcomeResponse, HealthRequest, HealthResponse } from 'apis';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private client: GeneralApi) {
    console.log('✅ GeneralService LATEST VERSION constructor called with injected GeneralApi client');
  }

  async getWelcome(): Promise<WelcomeResponse> {
    const request = new WelcomeRequest();
    return this.client.welcome(request);
  }

  async getHealth(): Promise<HealthResponse> {
    const request = new HealthRequest();
    return this.client.health(request);
  }
}
