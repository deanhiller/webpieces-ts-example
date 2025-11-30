import { Routes, RouteBuilder } from '@webpieces/core-meta';
import { ContextFilter, JsonFilter } from '@webpieces/http-filters';

export class FilterRoutes implements Routes {
  configure(routeBuilder: RouteBuilder): void {
    // Register ContextFilter with priority 140 (executes first)
    routeBuilder.addFilter({
      priority: 140,
      filterClass: ContextFilter,
    });

    // Register JsonFilter with priority 60 (executes after context)
    routeBuilder.addFilter({
      priority: 60,
      filterClass: JsonFilter,
    });
  }
}
