import { Component } from '@angular/core';

import { DashboardPageWrapperComponent } from '@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

@Component({
  selector: 'app-view-tokens-page',
  templateUrl: './view-tokens.page.html',
  styleUrls: ['./view-tokens.page.scss'],
  standalone: true,
  imports: [DashboardPageWrapperComponent],
})
export class ViewTokensPageComponent {
  onAddTokenClick() {
    console.log('Add stage button clicked');
  }
}
