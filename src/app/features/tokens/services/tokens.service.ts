import { Injectable } from '@angular/core';

import { BaseService } from '@app/core/base-service.core';

import { GetAllTokensByStatusDto } from '../dto/get-all-tokens-by-status.dto';


@Injectable({ providedIn: 'root' })
export class TokensService extends BaseService {

    // saveStage(dto: SaveStageDto) {
    //     return this.post('stage/save', dto);
    // }


    getAllTokensByStatus(status: string) {
        return this.get<GetAllTokensByStatusDto>(`tokens/${status}`);
    }
}
