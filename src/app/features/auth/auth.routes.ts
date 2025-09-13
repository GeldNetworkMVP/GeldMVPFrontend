import { Routes } from '@angular/router';
export const authRoutes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('../../shared/layouts/home/home.layout').then(
        (m) => m.HomeLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.page').then((m) => m.LoginPageComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register.page').then(
            (m) => m.RegisterPageComponent
          ),
      },
    ],
  },
];
