import { Provider } from '@angular/core';
import { createClient, ClientConfig } from '@webpieces/http-client';
import { LoginApiPrototype } from 'apis';

/**
 * Provider factory that creates the LoginApi HTTP client.
 * Reads decorators from LoginApiPrototype to generate the client.
 * Injects ClientConfig for baseUrl and headers.
 *
 * Provides LoginApiPrototype directly as the token (concrete class).
 */
export function provideLoginApi(): Provider {
  return {
    provide: LoginApiPrototype,
    useFactory: (config: ClientConfig) => {
      return createClient(LoginApiPrototype, config);
    },
    deps: [ClientConfig],
  };
}
