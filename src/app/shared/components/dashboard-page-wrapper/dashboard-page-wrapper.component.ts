import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';

import { ICONS_FOR_DASHBOARD_PAGES_MAP } from '@shared/constants/icons-for-dashboard-pages-map.constant';

@Component({
  selector: 'app-dashboard-page-wrapper',
  templateUrl: './dashboard-page-wrapper.component.html',
  styleUrls: ['./dashboard-page-wrapper.component.scss'],
  standalone: true,
  imports: [NgTemplateOutlet, BreadcrumbModule, ButtonModule, NgClass, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardPageWrapperComponent implements OnInit {
  title = input.required<string>();

  primaryButton = input<{
    action: () => void;
    label: string;
    icon?: string;
    severity?: "success" | "info" | "warning" | "danger" | "help" | "primary" | "secondary" | "contrast" | null | undefined,
    loading?: boolean;
    text?: boolean
  }>()

  secondaryButton = input<{
    action: () => void;
    label: string;
    icon?: string;
    severity?: "success" | "info" | "warning" | "danger" | "help" | "primary" | "secondary" | "contrast" | null | undefined
  }>()


  hasActionForAddButton = signal<boolean>(false);
  router = inject(Router);
  breadcrumbItems = signal<MenuItem[]>([]);
  isDashboardOverviewPage = signal<boolean>(false);

  ngOnInit() {
    this.setupBreadcrumbItems();
  }

  setupBreadcrumbItems() {
    const url = this.router.url;
    if (url === '/dashboard') {
      this.isDashboardOverviewPage.set(true);
    }
    const urlWithoutFirstSlash = url.slice(1);
    const urlSegments = urlWithoutFirstSlash.split('/');
    this.breadcrumbItems.set(
      urlSegments.map((segment, index) => {
        const url = `/${urlSegments.slice(0, index + 1).join('/')}`;
        const icon = ICONS_FOR_DASHBOARD_PAGES_MAP[url];
        return {
          label: segment,
          route: url,
          icon,
          isCurrentlyActive: index === urlSegments.length - 1,
        };
      })
    );
  }
}
