import { WebAppMeta, Routes } from '@webpieces/core-meta';
import { ContainerModule } from 'inversify';
import { RESTApiRoutes } from '@webpieces/http-routing';
import { GuiceModule } from './modules/GuiceModule';
import { FilterRoutes } from './routes/FilterRoutes';
import { LoginApiPrototype } from 'apis';
import { LoginController } from './controllers/LoginController';

export class ProdServerMeta implements WebAppMeta {
  getDIModules(): ContainerModule[] {
    return [GuiceModule];
  }

  getRoutes(): Routes[] {
    return [
      new FilterRoutes(),
      new RESTApiRoutes(LoginApiPrototype, LoginController),
    ];
  }
}
