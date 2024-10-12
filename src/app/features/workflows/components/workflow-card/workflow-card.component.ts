import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { Workflow } from '@features/workflows/models/workflow.model';

@Component({
  standalone: true,
  selector: 'app-workflow-card',
  templateUrl: './workflow-card.component.html',
  styleUrls: ['./workflow-card.component.scss'],
  imports: [TagModule, ButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WorkflowCardComponent {
  props = input.required<Workflow>();
  numOfStages = computed(() => this.props().stages.length);


  workflowSelectedToUpdate = output<Workflow>()
  workflowSelectedToDelete = output<Workflow>()


  updateModalVisible = signal(false);

  openEditDialog() {
    this.updateModalVisible.set(true);
    this.workflowSelectedToUpdate.emit(this.props())
  }

  openDeleteDialog() {
    this.workflowSelectedToDelete.emit(this.props())
  }

}
