import { dashboardRoutes } from '@features/dashboard/dashboard.routes';

import { authRoutes } from './features/auth/auth.routes';
import { homeRoutes } from './features/home/home.routes';
import { marketplaceRoutes } from './features/marketplace/marketplace.routes';

export const appRoutes = [
    ...homeRoutes,
    ...authRoutes,
    ...marketplaceRoutes,
    ...dashboardRoutes,
];
