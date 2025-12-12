import { Provider } from '@angular/core';
import { createClient, ClientConfig } from '@webpieces/http-client';
import { GeneralApi, GeneralApiPrototype } from 'apis';

/**
 * Provider factory that creates the GeneralApi HTTP client.
 *
 * Creates client using GeneralApiPrototype (to read @Get/@Path decorators),
 * but provides it as GeneralApi (the abstract interface).
 *
 * This follows dependency inversion: client code depends on the abstraction (GeneralApi),
 * not the implementation detail (GeneralApiPrototype with decorators).
 */
export function provideGeneralApi(): Provider {
  return {
    provide: GeneralApi,
    useFactory: (config: ClientConfig) => {
      return createClient(GeneralApiPrototype, config);
    },
    deps: [ClientConfig],
  };
}
