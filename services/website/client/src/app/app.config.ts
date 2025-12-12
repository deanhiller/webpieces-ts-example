import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { ClientConfig, createClient } from '@webpieces/http-client';
import { EnvironmentConfig } from './config/environment.config';
import { LoginApi, LoginApiPrototype, GeneralApi, GeneralApiPrototype } from 'apis';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    {
      provide: ClientConfig,
      useFactory: (envConfig: EnvironmentConfig) => {
        return new ClientConfig(envConfig.apiBaseUrl());
      },
      deps: [EnvironmentConfig]
    },
    {
      provide: LoginApi,
      useFactory: (config: ClientConfig) => {
        return createClient(LoginApiPrototype, config);
      },
      deps: [ClientConfig]
    },
    {
      provide: GeneralApi,
      useFactory: (config: ClientConfig) => {
        return createClient(GeneralApiPrototype, config);
      },
      deps: [ClientConfig]
    },
  ],
};
