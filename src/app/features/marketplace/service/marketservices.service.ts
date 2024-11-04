import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/base-service.core';
import { TokenStatus } from '../dto/market.dto';

@Injectable({
  providedIn: 'root'
})
export class MarketservicesService extends BaseService {

  updateTokenStatus(payload:TokenStatus) {
    console.log("here in put",payload)
    return this.put(`tokens/updatestatus`, payload);
  }
}
