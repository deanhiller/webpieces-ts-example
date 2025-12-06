import { WebAppMeta, Routes, RESTApiRoutes } from '@webpieces/http-routing';
import { ContainerModule } from 'inversify';
import { WebpiecesModule } from '@webpieces/http-server';
import { InversifyModule } from './modules/InversifyModule';
import { LoginApiPrototype, GeneralApiPrototype } from 'apis';
import { LoginController } from './controllers/LoginController';
import { HomeController } from './controllers/HomeController';
import { FilterRoutes } from './routes/FilterRoutes';

export class ProdServerMeta implements WebAppMeta {
  getDIModules(): ContainerModule[] {
    return [WebpiecesModule, InversifyModule];
  }

  getRoutes(): Routes[] {
    return [
      new FilterRoutes(),
      new RESTApiRoutes(GeneralApiPrototype, HomeController),
      new RESTApiRoutes(LoginApiPrototype, LoginController),
    ];
  }
}
