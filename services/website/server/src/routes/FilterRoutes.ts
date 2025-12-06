import { Routes, RouteBuilder, FilterDefinition } from '@webpieces/http-routing';
import { ContextFilter, LogApiFilter } from '@webpieces/http-server';

export class FilterRoutes implements Routes {
  configure(routeBuilder: RouteBuilder): void {
    // Register ContextFilter with priority 2000 (higher number = higher priority in 0.2.21)
    routeBuilder.addFilter(new FilterDefinition(2000, ContextFilter, '*'));

    // Register LogApiFilter with priority 1800 (runs after ContextFilter)
    // Logs all API requests/responses with [API-SVR-req], [API-SVR-resp-SUCCESS], etc.
    routeBuilder.addFilter(new FilterDefinition(1800, LogApiFilter, '*'));

    // Note: JsonFilter no longer needed in 0.2.17+ - JSON serialization is automatic via WebpiecesMiddleware
  }
}
