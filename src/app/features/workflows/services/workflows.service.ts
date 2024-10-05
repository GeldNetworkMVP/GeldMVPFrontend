import { Injectable } from '@angular/core';

import { BaseService } from '@app/core/base-service.core';

import { GetAllWorkflowsWithoutPaginationDto } from '../dto/get-all-workflows-without-pagination.dto';
import { SaveWorkflowDto } from '../dto/save-workflow.dto';


@Injectable({ providedIn: 'root' })
export class WorkflowsService extends BaseService {

    saveWorkflow(dto: SaveWorkflowDto) {
        return this.post('workflows/save', dto);
    }


    getAllWorkflowsWithoutPagination() {
        return this.get<GetAllWorkflowsWithoutPaginationDto>('workflows');
    }
}
