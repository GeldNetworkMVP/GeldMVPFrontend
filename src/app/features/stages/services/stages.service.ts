import { Injectable } from '@angular/core';

import { BaseService } from '@app/core/base-service.core';

import { GetAllStagesWithoutPaginationDto } from '../dto/get-all-stages-without-pagination.dto';
import { SaveStageDto } from '../dto/save-stage.dto';
import { Stage } from '../models/stage.model';


@Injectable({ providedIn: 'root' })
export class StagesService extends BaseService {

    saveStage(dto: SaveStageDto) {
        return this.post('stage/save', dto);
    }

    updateStage(dto: Stage) {
        return this.put('updatestage', dto);
    }

    removeStageById(id: string) {
        return this.delete(`stage/remove/${id}`);
    }


    getAllStagesWithoutPagination() {
        return this.get<GetAllStagesWithoutPaginationDto>('stages');
    }
}
