import { Routes } from '@angular/router';

export const workflowsRoutes: Routes = [
  {
    path: 'workflows',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/view-workflows/view-workflows.page').then(
            (m) => m.ViewWorkflowsPageComponent
          ),
      },
    ],
  },
];
