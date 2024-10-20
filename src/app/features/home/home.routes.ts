import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../shared/layouts/home/home.layout').then(
        (m) => m.HomeLayoutComponent
      ),
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
