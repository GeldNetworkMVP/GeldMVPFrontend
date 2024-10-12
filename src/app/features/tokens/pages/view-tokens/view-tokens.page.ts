import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';

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
  imports: [DashboardPageWrapperComponent, TokenCardComponent, PaginatorModule, SkeletonModule],
})
export class ViewTokensPageComponent implements OnInit {
  store = inject(Store);
  tokensService = inject(TokensService);
  router = inject(Router);

  tokens = this.store.selectSignal(TokensState.getTokens);
  loading = this.store.selectSignal(TokensState.getTokensLoading);

  first = signal<number>(0);
  totalRecords = signal(0);
  rows = signal(10);
  page = signal(0);

  skeletons = [1, 2, 3, 4, 5, 6] 

  handlePagination(event: PaginatorState) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
    this.page.set((event.page ?? 0) + 1);
  }

  ngOnInit() {
    this.loadTokens();
  }

  loadTokens() {
    this.store.dispatch(new SetTokensLoading(true));
    this.tokensService
      .getAllTokensByStatus({
        limit: this.rows(),
        page: this.page(),
        sort: 1,
        status: 'onsale',
      })
      .subscribe((data) => {
        this.store.dispatch(new SetTokens(data.Response.content));
        this.store.dispatch(new SetTokensLoading(false));
        this.totalRecords.set(data.Response.PaginationInfo.totalelements);
      });
  }

  constructor() {
    effect(() => {
      this.store.dispatch(new SetTokensLoading(true));
      this.tokensService
        .getAllTokensByStatus({
          limit: this.rows(),
          page: this.page(),
          sort: 1,
          status: 'onsale',
        })
        .subscribe((data) => {
          this.store.dispatch(new SetTokens(data.Response.content));
          this.store.dispatch(new SetTokensLoading(false));
          this.totalRecords.set(data.Response.PaginationInfo.totalelements);
        });
    });
  }

  onAddTokenClick() {
    return () => this.router.navigate(['/dashboard/tokens/new']);
  }

  onViewMarketClick() {
    return () => this.router.navigate(['/marketplace']);
  }
}
