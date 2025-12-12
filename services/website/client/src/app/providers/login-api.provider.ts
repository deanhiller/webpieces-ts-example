import { Provider } from '@angular/core';
import { createClient, ClientConfig } from '@webpieces/http-client';
import { LoginApi, LoginApiPrototype } from 'apis';

/**
 * Provider factory that creates the LoginApi HTTP client.
 *
 * Creates client using LoginApiPrototype (to read @Post/@Path decorators),
 * but provides it as LoginApi (the abstract interface).
 *
 * This follows dependency inversion: client code depends on the abstraction (LoginApi),
 * not the implementation detail (LoginApiPrototype with decorators).
 */
export function provideLoginApi(): Provider {
  return {
    provide: LoginApi,
    useFactory: (config: ClientConfig) => {
      return createClient(LoginApiPrototype, config);
    },
    deps: [ClientConfig],
  };
}
