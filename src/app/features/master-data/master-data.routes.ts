import { Routes } from '@angular/router';

export const masterDataRoutes: Routes = [
  {
    path: 'master-data',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/view-master-data/view-master-data.page').then(
            (m) => m.ViewMasterDataPageComponent
          ),
      },
    ],
  },
];
