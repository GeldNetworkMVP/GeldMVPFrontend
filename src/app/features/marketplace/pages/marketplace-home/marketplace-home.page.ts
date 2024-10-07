import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
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

  marketPlaceSearchForm = new FormGroup<{
    search: FormControl<string | null>;
  }>({
    search: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  destroy = new Subject<void>();

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
    this.tokensService.getAllTokensByStatus('OnSale').subscribe((data) => {
      this.store.dispatch(new SetTokens(data.Response.content));
      this.store.dispatch(new SetTokensLoading(false));
    });
  }
}
