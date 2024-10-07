import { Routes } from '@angular/router';
import { provideStore } from '@ngxs/store';

import { TokensState } from './stores/tokens-store/tokens.state';

export const tokensRoutes: Routes = [
  {
    path: 'tokens',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/view-tokens/view-tokens.page').then(
            (m) => m.ViewTokensPageComponent
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./pages/create-token/create-token.page').then(
            (m) => m.CreateTokenPageComponent
          ),
      },
    ],
    providers: [provideStore([TokensState])],
  },
];
