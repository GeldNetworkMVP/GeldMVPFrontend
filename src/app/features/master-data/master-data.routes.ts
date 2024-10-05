import { Routes } from '@angular/router';
import { provideStore } from '@ngxs/store';

import { MasterDataState } from './stores/master-data-store/master-data.state';

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
      {
        path: ':id',
        loadComponent: () =>
          import(
            './pages/view-data-in-master-data-containers/view-data-in-master-data-containers.page'
          ).then((m) => m.ViewDataInMasterDataContainersPageComponent),
      },
    ],
    providers: [provideStore([MasterDataState])],
  },
];
