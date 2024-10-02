import { Component } from '@angular/core';

import { TokenCardComponent } from '@features/tokens/components/token-card/token-card.component';

import { DashboardPageWrapperComponent } from '@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

@Component({
  selector: 'app-view-tokens-page',
  templateUrl: './view-tokens.page.html',
  styleUrls: ['./view-tokens.page.scss'],
  standalone: true,
  imports: [DashboardPageWrapperComponent, TokenCardComponent],
})
export class ViewTokensPageComponent {


  dummyTokens = [
    {
      _id: 1,
      tokenName: 'Token 1',
      xlm: 100,
    },
    {
      _id: 2,
      tokenName: 'Token 2',
      xlm: 200,
    },
    {
      _id: 3,
      tokenName: 'Token 3',
      xlm: 300,
    },
  ];

  onAddTokenClick() {
    console.log('Add stage button clicked');
  }

  onViewMarketClick() {
    console.log('View market button clicked');
  }
}
