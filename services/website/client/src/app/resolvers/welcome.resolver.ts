import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { GeneralService } from '../services/general.service';

export const welcomeResolver: ResolveFn<unknown> = async () => {
  const generalService = inject(GeneralService);
  const result = await generalService.getWelcome();
  return {
    testName: 'GET /welcome',
    result,
    error: null
  };
};
