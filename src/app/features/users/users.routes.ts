import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  {
    path: 'users',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/view-users/view-users.page').then(
            (m) => m.ViewUsersPageComponent
          ),
      },
    ],
  },
];
