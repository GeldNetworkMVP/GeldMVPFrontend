import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { provideStore } from '@ngxs/store';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';

import { appRoutes } from './app.routes';
import { AuthInterceptor } from './features/auth/interceptors/auth.interceptor';
import { AuthState } from './features/auth/stores/auth-store/auth.state';

const initializePrimeNGConfig = (primeConfig: PrimeNGConfig) => () => {
  primeConfig.ripple = true;
};

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializePrimeNGConfig,
      deps: [PrimeNGConfig],
      multi: true,
    },
    provideRouter(appRoutes),
    // importProvidersFrom(
    //   AuthModule.forRoot({
    //     domain: 'dev-0l5komhx4zv7zk1x.us.auth0.com',
    //     clientId: 'Mp9IYaVGC2k31gDpWGBcU7SIFofXVla7',
    //     useRefreshTokens: true,
    //     useRefreshTokensFallback: false,
    //     authorizationParams: {
    //       redirect_uri: '',
    //     },
    //   })
    // ),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideStore([AuthState], withNgxsReduxDevtoolsPlugin()),
    MessageService,
    ConfirmationService,
  ],
};
