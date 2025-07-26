import { CommonModule } from '@angular/common';
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

import { Token } from '@app/features/tokens/models/token.model';
import { TokensService } from '@app/features/tokens/services/tokens.service';
import {
  SetTokens,
  SetTokensLoading,
} from '@app/features/tokens/stores/tokens-store/tokens-data.actions';
import { TokensState } from '@app/features/tokens/stores/tokens-store/tokens.state';
import { commonModules } from '@app/shared/modules/common.modules';

import { MarketplaceTokenCardComponent } from '../../components/marketplace-token-card/marketplace-token-card.component';
import albedo from '@albedo-link/intent';

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
    CommonModule
  ],
})
export class MarketplaceHomePageComponent implements OnInit, OnDestroy {
  store = inject(Store);
  tokensService = inject(TokensService);

  tokens = this.store.selectSignal(TokensState.getTokens);
  loading = this.store.selectSignal(TokensState.getTokensLoading);
  sidebarVisible = signal(false);

  selectedToken: Token | null = null;
  marketPlaceSearchForm = new FormGroup<{
    search: FormControl<string | null>;
  }>({
    search: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  destroy = new Subject<void>();

  first = signal<number>(0);
  totalRecords = signal(0);
  rows = signal(6);
  page = signal(0);

  skeletons = [1, 2, 3, 4, 5, 6]

  walletConnected: boolean = false;
  walletProvider: 'albedo' | null = null;
  walletBalance: number | null = null;
  walletPublicKey: string | null = null;
  albedopk: any;

  handlePagination(event: PaginatorState) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 6);
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

  onReserveToken(token: Token) {
    this.selectedToken = token; 
  }

  trackByTokenId(index: number, token: Token): string {
    return token._id; 
  }

  trackBySkeleton(index: number): number {
    return index;
  }

  async connectAlbedo() {
  try {
   await albedo
      .publicKey({
        require_existing: true,
      })
      .then((res: any) => {
        this.albedopk = res.pubkey;
      });
    const userPK = this.albedopk;
    this.walletPublicKey = userPK;
    this.walletConnected = true;
    this.walletProvider = 'albedo';
    this.walletBalance = await this.fetchBalance(userPK);
    this.sidebarVisible = signal(false);
  } catch (e) {
    // handle error, e.g., alert user
    this.walletConnected = false;
    this.walletProvider = null;
    this.walletBalance = null;
    this.walletPublicKey = null;
  }
}

async fetchBalance(publicKey: string): Promise<number> {
  const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
  const data = await res.json();
  const xlmBalance = data.balances.find((b: any) => b.asset_type === 'native')?.balance;
  return parseFloat(xlmBalance || '0');
}
}

