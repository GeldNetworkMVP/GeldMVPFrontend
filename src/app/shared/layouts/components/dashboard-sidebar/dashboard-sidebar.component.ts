import { Component } from '@angular/core';

import { ICONS_FOR_DASHBOARD_PAGES_MAP } from '@shared/constants/icons-for-dashboard-pages-map.constant';

import {
  DashboardSidebarItemComponent,
  DashboardSidebarItemComponentProps,
} from '../dashboard-sidebar-item/dashboard-sidebar-item.component';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.scss'],
  standalone: true,
  imports: [DashboardSidebarItemComponent],
})
export class DashboardSidebarComponent {
  dashboardSidebarItems: DashboardSidebarItemComponentProps[] = [
    {
        title: 'Overview',
        link: '/dashboard',
    },
    {
      title: 'Master Data',
      link: '/dashboard/master-data',
    },
    {
      title: 'Stages',
      link: '/dashboard/stages',
    },
    {
      title: 'Workflows',
      link: '/dashboard/workflows',
    },
    {
      title: 'Tokens',
      link: '/dashboard/tokens',
    },
  ].map((item) => ({
    ...item,
    icon: ICONS_FOR_DASHBOARD_PAGES_MAP[item.link],
  }));
}
