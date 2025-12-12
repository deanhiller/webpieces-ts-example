import { Route } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ApiDemoComponent } from './api-demo/api-demo.component';

export const appRoutes: Route[] = [
  {
    path: 'api-demo',
    component: ApiDemoComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: 'api-demo',
    pathMatch: 'full'
  }
];
