import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    children: [
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/overview/overview.page').then(
            (m) => m.OverviewPageComponent
          ),
      },
    ],
  },
];
