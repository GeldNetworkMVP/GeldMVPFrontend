import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { TokenCardComponent } from '@features/tokens/components/token-card/token-card.component';

import { DashboardPageWrapperComponent } from '@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

import { TokensService } from '../../services/tokens.service';
import {
  SetTokens,
  SetTokensLoading,
} from '../../stores/tokens-store/tokens-data.actions';
import { TokensState } from '../../stores/tokens-store/tokens.state';

@Component({
  selector: 'app-view-tokens-page',
  templateUrl: './view-tokens.page.html',
  styleUrls: ['./view-tokens.page.scss'],
  standalone: true,
  imports: [DashboardPageWrapperComponent, TokenCardComponent],
})
export class ViewTokensPageComponent implements OnInit {
  store = inject(Store);
  tokensService = inject(TokensService);
  router = inject(Router);

  tokens = this.store.selectSignal(TokensState.getTokens);
  loading = this.store.selectSignal(TokensState.getTokensLoading);

  ngOnInit() {
    this.loadTokens();
  }

  loadTokens() {
    this.store.dispatch(new SetTokensLoading(true));
    this.tokensService.getAllTokensByStatus('OnSale').subscribe((data) => {
      this.store.dispatch(new SetTokens(data.Response.content));
      this.store.dispatch(new SetTokensLoading(false));
    });
  }

  onAddTokenClick() {
    return () => this.router.navigate(['/dashboard/tokens/new']);
  }

  onViewMarketClick() {
    console.log('View market button clicked');
  }
}
