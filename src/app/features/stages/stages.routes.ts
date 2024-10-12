import { Routes } from '@angular/router';
import { provideStore } from '@ngxs/store';

import { StagesState } from './stores/stages-store/stages.state';

export const stagesRoutes: Routes = [
  {
    path: 'stages',
    providers: [provideStore([StagesState])],
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
