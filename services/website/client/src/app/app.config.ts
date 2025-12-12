import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { ClientConfig } from '@webpieces/http-client';
import { provideLoginApi } from './providers/login-api.provider';
import { provideGeneralApi } from './providers/general-api.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    {
      provide: ClientConfig,
      useValue: new ClientConfig('http://localhost:3000')
    },
    provideLoginApi(),
    provideGeneralApi(),
  ],
};
