import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
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
}
