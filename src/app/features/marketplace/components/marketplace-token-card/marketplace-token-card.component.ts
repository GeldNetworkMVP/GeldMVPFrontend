import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ManageBuyOfferService } from '../../blockchain/manage-buy-offer.service';
import { Token } from '@app/features/tokens/models/token.model';
import albedo from '@albedo-link/intent';


@Component({
  standalone: true,
  selector: 'app-marketplace-token-card',
  templateUrl: './marketplace-token-card.component.html',
  styleUrls: ['./marketplace-token-card.component.scss'],
  imports: [TagModule, ButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MarketplaceTokenCardComponent {
  props = input.required<Token>();
  isLoadingPresent: boolean | undefined;
  loading: any;
  albedopk: any;
  hash: any;

constructor(
  private service:ManageBuyOfferService,
){
}

  async BuyToken(): Promise<void> {
    await albedo
    .publicKey({
      require_existing: true,
    })
    .then((res: any) => {
      this.albedopk = res.pubkey;
    });
    let userPK = this.albedopk;
    this.service.buyToken(
        "StellarC", //token-name
        "GASL7O3TGVS5HI7D6T667UMLFCG4S7GOPEK6YNYTXLKKKXJSIWGRNNPC",//asset-issuer
        "GA2DD6SS2BXAD6SQ6M57KNDWKXEVZD2DXU62FFDYP3RVGII7O3XIATGQ",//geld-pk
        userPK,//wallet user
        "10"//price
      )
      .then((transactionResult: any) => {
         console.log("result: ",transactionResult)
        if (transactionResult.successful) {
       this.hash=transactionResult.tx_hash
        } else {
          if (this.isLoadingPresent) {
            this.dissmissLoading();
          }
        }
      });
  }

  dissmissLoading() {
    this.isLoadingPresent = false;
    this.loading.dismiss();
  }
  
}



