import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorState, PaginatorModule } from 'primeng/paginator';
import {SidebarModule} from 'primeng/sidebar'
import { SkeletonModule } from 'primeng/skeleton';
import { debounceTime, Subject, takeUntil } from 'rxjs';

import { TokensService } from '@app/features/tokens/services/tokens.service';
import {
  SetTokens,
  SetTokensLoading,
} from '@app/features/tokens/stores/tokens-store/tokens-data.actions';
import { TokensState } from '@app/features/tokens/stores/tokens-store/tokens.state';
import { commonModules } from '@app/shared/modules/common.modules';

import { MarketplaceTokenCardComponent } from '../../components/marketplace-token-card/marketplace-token-card.component';

@Component({
  standalone: true,
  selector: 'app-marketplace-home-page',
  templateUrl: './marketplace-home.page.html',
  styleUrls: ['./marketplace-home.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    ButtonModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    PaginatorModule,
    SkeletonModule,
    SidebarModule,
    RouterLink,
    MarketplaceTokenCardComponent,
    ...commonModules,
  ],
})
export class MarketplaceHomePageComponent implements OnInit, OnDestroy {
  store = inject(Store);
  tokensService = inject(TokensService);

  tokens = this.store.selectSignal(TokensState.getTokens);
  loading = this.store.selectSignal(TokensState.getTokensLoading);
  sidebarVisible = signal(false);

  marketPlaceSearchForm = new FormGroup<{
    search: FormControl<string | null>;
  }>({
    search: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  destroy = new Subject<void>();

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

  ngOnInit(): void {
    this.loadTokens();
    this.marketPlaceSearchForm.valueChanges
      .pipe(takeUntil(this.destroy), debounceTime(300))
      .subscribe((value) => {
        const searchTerm = value.search;
        console.log(searchTerm);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
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

  openSidebar() {
    this.sidebarVisible.set(true)
  }
}
