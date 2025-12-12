import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { GeneralService } from '../services/general.service';

export const healthResolver: ResolveFn<unknown> = async () => {
  const generalService = inject(GeneralService);
  const result = await generalService.getHealth();
  return {
    testName: 'GET /api/health',
    result,
    error: null
  };
};
