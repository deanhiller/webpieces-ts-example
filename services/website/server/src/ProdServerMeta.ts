import { WebAppMeta, Routes } from '@webpieces/core-meta';
import { ContainerModule } from 'inversify';
import { RESTApiRoutes } from '@webpieces/http-routing';
import { GuiceModule } from './modules/GuiceModule';
import { FilterRoutes } from './routes/FilterRoutes';
import { LoginApiPrototype, GeneralApiPrototype } from 'apis';
import { LoginController } from './controllers/LoginController';
import { HomeController } from './controllers/HomeController';

export class ProdServerMeta implements WebAppMeta {
  getDIModules(): ContainerModule[] {
    return [GuiceModule];
  }

  getRoutes(): Routes[] {
    return [
      new RESTApiRoutes(GeneralApiPrototype, HomeController),
      new RESTApiRoutes(LoginApiPrototype, LoginController),
      new FilterRoutes(),
    ];
  }
}
