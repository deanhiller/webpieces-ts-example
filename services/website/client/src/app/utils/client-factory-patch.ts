import { ClientConfig } from '@webpieces/http-client';
import { getRoutes, isApiInterface, LogApiCall, HeaderMethods } from '@webpieces/http-api';

/**
 * Patched version of createClient that handles Angular DI inspection properly.
 *
 * The original createClient() in @webpieces/http-client has a Proxy that throws
 * errors when Angular's DI system tries to access non-route properties like
 * 'constructor', 'prototype', etc.
 *
 * This version checks if the property is actually a route method before
 * trying to look it up, returning undefined for non-route properties.
 */
export function createClientPatched<T extends object>(
  apiPrototype: Function & { prototype: T },
  config: ClientConfig
): T {
  // Validate that the API prototype is marked with @ApiInterface
  if (!isApiInterface(apiPrototype)) {
    const className = apiPrototype.name || 'Unknown';
    throw new Error(`Class ${className} must be decorated with @ApiInterface()`);
  }

  // Get all routes from the API prototype
  const routes = getRoutes(apiPrototype);

  // Create a map of method name -> route metadata for fast lookup
  const routeMap = new Map();
  for (const route of routes) {
    routeMap.set(route.methodName, route);
  }

  // Create ProxyClient-like object
  const baseUrl = config.baseUrl;
  const logApiCall = new LogApiCall();
  const headerMethods = new HeaderMethods();

  // Create a proxy that intercepts method calls and makes HTTP requests
  return new Proxy({} as T, {
    get(_target, prop) {
      // Only handle string properties (method names)
      if (typeof prop !== 'string') {
        return undefined;
      }

      // Check if this property is actually a route method
      const route = routeMap.get(prop);
      if (!route) {
        // Not a route method - return undefined instead of throwing
        // This allows Angular's DI to inspect the object without errors
        return undefined;
      }

      // Return a function that makes the HTTP request
      return async (...args: any[]) => {
        const { httpMethod, path } = route;

        // Build the full URL
        const url = `${baseUrl}${path}`;

        // Build headers
        const httpHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        // Build request options
        const options: RequestInit = {
          method: httpMethod,
          headers: httpHeaders,
        };

        // Get the request DTO (first argument)
        // For GET requests, this is just for logging
        // For POST/PUT/PATCH, this goes in the body
        const requestDto = args.length > 0 ? args[0] : undefined;

        // For POST/PUT/PATCH, include the body as JSON
        if (['POST', 'PUT', 'PATCH'].includes(httpMethod) && requestDto) {
          options.body = JSON.stringify(requestDto);
        }

        // Make the request with logging
        const method = async () => {
          const response = await fetch(url, options);
          if (response.ok) {
            return await response.json();
          }
          // Handle errors
          const errorData = await response.json();
          const error = new Error(`HTTP ${response.status}: ${errorData.message || 'Unknown error'}`);
          (error as any).status = response.status;
          (error as any).data = errorData;
          throw error;
        };

        return await logApiCall.execute(
          "CLIENT",
          route,
          requestDto,
          new Map(),
          method
        );
      };
    },
  });
}
