import { Injectable } from '@angular/core';

import { BaseService } from '@app/core/base-service.core';

import {
  GetAllTokensByStatusDto,
  GetAllTokensByStatusQueryParams,
} from '../dto/get-all-tokens-by-status.dto';
import { GetTransactionsBasedOnPlotIdDto } from '../dto/get-transactions-based-on-plotid.dto';
import { SaveTokenDto } from '../dto/save-token.dto';

@Injectable({ providedIn: 'root' })
export class TokensService extends BaseService {
  // saveStage(dto: SaveStageDto) {
  //     return this.post('stage/save', dto);
  // }

  getAllTokensByStatus({
    limit,
    page,
    sort,
    status,
  }: GetAllTokensByStatusQueryParams) {
    const params = {
      limit,
      page,
      sort,
    };
    return this.get<GetAllTokensByStatusDto>(`tokens/${status}`, {
      params: params,
    });
  }

  getTransactionsBasedOnPlotId(plotId: string) {
    return this.get<GetTransactionsBasedOnPlotIdDto>(
      `transactions/plot/${plotId}`
    );
  }

  saveToken(dto: SaveTokenDto) {
    return this.post('token/save', dto);
  }
}
