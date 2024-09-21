import { Routes } from '@angular/router';

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
  },
];
