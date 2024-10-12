import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home-page/home-page.page').then(
            (m) => m.HomePageComponent
          ),
      },
    ],
  },
];
