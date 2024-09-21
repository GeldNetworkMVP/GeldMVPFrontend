import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-sidebar-item',
  templateUrl: './dashboard-sidebar-item.component.html',
  styleUrls: ['./dashboard-sidebar-item.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class DashboardSidebarItemComponent {
    props = input.required<DashboardSidebarItemComponentProps>();
}


export interface DashboardSidebarItemComponentProps {
    icon: string;
    title: string;
    link: string;
}
