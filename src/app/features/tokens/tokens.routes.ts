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
    ],
    providers: [provideStore([TokensState])]
  },
];
