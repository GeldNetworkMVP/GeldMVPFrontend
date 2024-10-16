import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ManageBuyOfferService } from '../../blockchain/manage-buy-offer.service';
import { Token } from '@app/features/tokens/models/token.model';
import { UserWallet } from '../../models/userwallet';
import { FreighterComponentService } from '../../freighter-services/freighter-component.service';


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

constructor(
  private service:ManageBuyOfferService,
){
}

  async BuyToken(): Promise<void> {
    console.log('we here!')
    let walletf = new UserWallet();
    walletf = new FreighterComponentService(walletf);
    await walletf.initWallelt();
    let userPK = await walletf.getWalletaddress();
    this.service.buyToken(
        "StellarC",
        "GASL7O3TGVS5HI7D6T667UMLFCG4S7GOPEK6YNYTXLKKKXJSIWGRNNPC",
        "GA2DD6SS2BXAD6SQ6M57KNDWKXEVZD2DXU62FFDYP3RVGII7O3XIATGQ",
        userPK,
        "10"
      )
      .then((transactionResult: any) => {
        if (transactionResult.successful) {
          console.log("result: ",transactionResult)
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



