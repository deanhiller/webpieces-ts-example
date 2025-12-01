import { Routes, RouteBuilder, FilterDefinition } from '@webpieces/core-meta';
import { ContextFilter, JsonFilter } from '@webpieces/http-filters';

export class FilterRoutes implements Routes {
  configure(routeBuilder: RouteBuilder): void {
    // Register ContextFilter with priority 140 (executes first)
    routeBuilder.addFilter(new FilterDefinition(140, ContextFilter, '.*'));

    // Register JsonFilter with priority 60 (executes after context)
    routeBuilder.addFilter(new FilterDefinition(60, JsonFilter, '.*'));
  }
}
