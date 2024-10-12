import { Routes } from '@angular/router';

import { masterDataRoutes } from '@features/master-data/master-data.routes';
import { stagesRoutes } from '@features/stages/stages.routes';
import { tokensRoutes } from '@features/tokens/tokens.routes';
import { workflowsRoutes } from '@features/workflows/workflows.routes';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../../shared/layouts/dashboard/dashboard.layout').then(
        (m) => m.DashboardLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/overview/overview.page').then(
            (m) => m.OverviewPageComponent
          ),
      },
      ...masterDataRoutes,
      ...stagesRoutes,
      ...workflowsRoutes,
      ...tokensRoutes,
    ],
  },
];
