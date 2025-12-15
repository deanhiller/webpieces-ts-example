import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { ClientConfig, createClient } from '@webpieces/http-client';
import { EnvironmentConfig } from './config/environment.config';
import { GeneralApi, GeneralApiPrototype } from 'apis';
import { LoginApi, LoginApiPrototype } from 'apis';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    {
      provide: ClientConfig,
      useFactory: (envConfig: EnvironmentConfig) => {
        console.log('🔧 Creating ClientConfig with API URL:', envConfig.apiBaseUrl());
        return new ClientConfig(envConfig.apiBaseUrl());
      },
      deps: [EnvironmentConfig]
    },
    {
      provide: GeneralApi,
      useFactory: (config: ClientConfig) => {
        console.log('🔧 Creating GeneralApi client');
        return createClient(GeneralApiPrototype, config);
      },
      deps: [ClientConfig]
    },
    {
      provide: LoginApi,
      useFactory: (config: ClientConfig) => {
        console.log('🔧 Creating LoginApi client');
        return createClient(LoginApiPrototype, config);
      },
      deps: [ClientConfig]
    },
  ],
};
