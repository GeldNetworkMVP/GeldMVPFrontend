import { dashboardRoutes } from '@features/dashboard/dashboard.routes';

import { homeRoutes } from './features/home/home.routes';
import { marketplaceRoutes } from './features/marketplace/marketplace.routes';

export const appRoutes = [
    ...homeRoutes,
    ...marketplaceRoutes,
    ...dashboardRoutes
];
