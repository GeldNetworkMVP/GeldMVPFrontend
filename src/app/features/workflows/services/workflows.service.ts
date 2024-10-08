import { Injectable } from '@angular/core';

import { BaseService } from '@app/core/base-service.core';

import { GetAllWorkflowsWithoutPaginationDto } from '../dto/get-all-workflows-without-pagination.dto';
import { SaveWorkflowDto } from '../dto/save-workflow.dto';
import { Workflow } from '../models/workflow.model';

@Injectable({ providedIn: 'root' })
export class WorkflowsService extends BaseService {
  saveWorkflow(dto: SaveWorkflowDto) {
    return this.post('workflows/save', dto);
  }

  updateWorkflow(dto: Workflow) {
    return this.put('updateworkflow', dto);
  }

  getAllWorkflowsWithoutPagination() {
    return this.get<GetAllWorkflowsWithoutPaginationDto>('workflows');
  }


  removeWorkflowById(id: string) {
    return this.delete(`workflows/remove/${id}`);
  }
}
