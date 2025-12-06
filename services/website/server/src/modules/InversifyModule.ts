import { ContainerModule } from 'inversify';

export const InversifyModule = new ContainerModule((options) => {
  const { bind } = options;
  // Controllers use @provideSingleton() decorator - no manual binding needed

  // Note: Filters like ContextFilter are automatically registered by WebpiecesFactory
  // Note: JsonFilter no longer exists in 0.2.17+ - JSON serialization is automatic via WebpiecesMiddleware
});
