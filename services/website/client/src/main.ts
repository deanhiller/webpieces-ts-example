console.log('🚀🚀🚀 PATCHED VERSION - requestDto fixed - 2025-12-12 12:56 🚀🚀🚀');

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
