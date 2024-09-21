import { Routes } from '@angular/router';

export const stagesRoutes: Routes = [
  {
    path: 'stages',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/view-stages/view-stages.page').then(
            (m) => m.ViewStagesPageComponent
          ),
      },
    ],
  },
];
