import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LoginService } from '../services/login.service';

export const loginResolver: ResolveFn<unknown> = async () => {
  const loginService = inject(LoginService);
  const result = await loginService.login('demo', 'password123');
  return {
    testName: 'POST /api/auth/login',
    result,
    error: null
  };
};
