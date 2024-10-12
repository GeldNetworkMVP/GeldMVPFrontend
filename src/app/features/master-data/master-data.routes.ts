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
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './pages/view-data-in-master-data-containers/view-data-in-master-data-containers.page'
              ).then((m) => m.ViewDataInMasterDataContainersPageComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import(
                './pages/create-master-data-record/create-master-data-record.page'
              ).then((m) => m.CreateMasterRecordPageComponent),
          },
          {
            path: 'edit/:recordId',
            loadComponent: () =>
              import(
                './pages/update-master-data-record/update-master-data-record.page'
              ).then((m) => m.UpdateMasterRecordPageComponent),
          },
        ],
      },
    ],
    providers: [provideStore([MasterDataState])],
  },
];
