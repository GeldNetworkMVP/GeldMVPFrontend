import { dashboardRoutes } from '@features/dashboard/dashboard.routes';

import { homeRoutes } from './features/home/home.routes';

export const appRoutes = [
    ...homeRoutes,
    ...dashboardRoutes
];
