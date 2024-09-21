import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AuthModule } from '@auth0/auth0-angular';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { provideStore } from '@ngxs/store';
import { PrimeNGConfig } from 'primeng/api';

import { appRoutes } from './app.routes';

const initializePrimeNGConfig = (primeConfig: PrimeNGConfig) => () => {
  primeConfig.ripple = true;
};

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializePrimeNGConfig,
      deps: [PrimeNGConfig],
      multi: true,
    },
    provideRouter(appRoutes),
    importProvidersFrom(
      AuthModule.forRoot({
        domain: 'dev-0l5komhx4zv7zk1x.us.auth0.com',
        clientId: 'Mp9IYaVGC2k31gDpWGBcU7SIFofXVla7',
        useRefreshTokens: true,
        useRefreshTokensFallback: false,
        authorizationParams: {
          redirect_uri: '',
        },
      })
    ),
    provideAnimations(),
    provideStore([], withNgxsReduxDevtoolsPlugin(), withNgxsLoggerPlugin()),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore([], withNgxsReduxDevtoolsPlugin(), withNgxsLoggerPlugin()),
  ],
};
