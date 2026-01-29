import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { tokenInterceptor } from './services/token.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor])
    )
  ]
  // providers: [
  //   provideBrowserGlobalErrorListeners(),
  //   provideRouter(routes),
  //   provideHttpClient(
  //     withFetch(), 
  //     withInterceptors([tokenInterceptor])
  //   )
  // ]
};
