import { ContainerModule } from 'inversify';
import { HomeController } from '../controllers/HomeController';
import { LoginController } from '../controllers/LoginController';
import { ContextFilter } from '@webpieces/http-filters';
import { JsonFilter } from '@webpieces/http-filters';

export const GuiceModule = new ContainerModule((options) => {
  const { bind } = options;
  // Controllers
  bind(HomeController).toSelf().inSingletonScope();
  bind(LoginController).toSelf().inSingletonScope();

  // Filters
  bind(ContextFilter).toSelf().inSingletonScope();
  bind(JsonFilter).toSelf().inSingletonScope();
});
