import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';

import { DashboardHeaderComponent } from '../components/dashboard-header/dashboard-header.component';
import { DashboardSidebarComponent } from '../components/dashboard-sidebar/dashboard-sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard.layout.html',
  styleUrls: ['./dashboard.layout.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    DashboardHeaderComponent,
    DashboardSidebarComponent,
    BreadcrumbModule,
    NgIf,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardLayoutComponent  {
}
