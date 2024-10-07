import { Component } from '@angular/core';

import { DashboardPageWrapperComponent } from '@app/shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

@Component({
  selector: 'app-create-token-page',
  templateUrl: './create-token.page.html',
  styleUrls: ['./create-token.page.scss'],
  standalone: true,
  imports: [DashboardPageWrapperComponent]
})
export class CreateTokenPageComponent {}
