import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestResultComponent } from './test-result/test-result.component';
import { welcomeResolver } from './resolvers/welcome.resolver';
import { healthResolver } from './resolvers/health.resolver';
import { loginResolver } from './resolvers/login.resolver';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'test/welcome',
    component: TestResultComponent,
    resolve: { data: welcomeResolver },
  },
  {
    path: 'test/health',
    component: TestResultComponent,
    resolve: { data: healthResolver },
  },
  {
    path: 'test/login',
    component: TestResultComponent,
    resolve: { data: loginResolver },
  },
];
