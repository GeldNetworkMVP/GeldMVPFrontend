import { Routes } from '@angular/router';
import { provideStore } from '@ngxs/store';

import { TokensState } from '../tokens/stores/tokens-store/tokens.state';

export const marketplaceRoutes: Routes = [
  {
    path: 'marketplace',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/marketplace-home/marketplace-home.page').then(
            (m) => m.MarketplaceHomePageComponent
          ),
      },
    ],
    providers: [provideStore([TokensState])],
  },
];
