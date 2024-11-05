import albedo from '@albedo-link/intent';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import {ToastModule} from 'primeng/toast'

import { Token } from '@app/features/tokens/models/token.model';

import { ManageBuyOfferService } from '../../blockchain/manage-buy-offer.service';
import { MarketservicesService } from '../../service/marketservices.service';

@Component({
  standalone: true,
  selector: 'app-marketplace-token-card',
  templateUrl: './marketplace-token-card.component.html',
  styleUrls: ['./marketplace-token-card.component.scss'],
  imports: [TagModule, ButtonModule, ToastModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MarketplaceTokenCardComponent {
  // props = input.required<Token>();
  @Input() props!: Token; // Token details passed from parent
  @Output() reserveToken = new EventEmitter<Token>(); // Event to emit on Reserve click
  isLoadingPresent: boolean | undefined;
  loading: any;
  albedopk: any;
  hash: any;
  token: any;

  constructor(
    private service: ManageBuyOfferService,
    private mservice: MarketservicesService,
    private messageService : MessageService
  ) {}

  async BuyToken(): Promise<void> {
    this.reserveToken.emit(this.props);
    await albedo
      .publicKey({
        require_existing: true,
      })
      .then((res: any) => {
        this.albedopk = res.pubkey;
      });
    const userPK = this.albedopk;
    this.service
      .buyToken(
        this.props.tokenname, //token-name
        this.props.tokenissuer, //asset-issuer
        'GA2DD6SS2BXAD6SQ6M57KNDWKXEVZD2DXU62FFDYP3RVGII7O3XIATGQ', //geld-pk
        userPK, //wallet user
        this.props.price //price
      )
      .then((transactionResult: any) => {
        console.log('result: ', transactionResult);
        if (transactionResult.horizonResult.successful) {
          console.log('here ');
          this.hash = transactionResult.tx_hash;
          const obj = {
            _id: this.props._id,
            bcstatus: 'reserved',
            tokenhash: this.hash,
          };
          console.log('here 2 ', obj);
          this.mservice.updateTokenStatus(obj).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Token reserved successfully',
              });
            },
            error: (error) => {
              console.error(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Token reservation failed',
              });
            },
          });
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
