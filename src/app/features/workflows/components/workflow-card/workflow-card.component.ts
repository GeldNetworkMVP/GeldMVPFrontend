import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  standalone: true,
  selector: 'app-workflow-card',
  templateUrl: './workflow-card.component.html',
  styleUrls: ['./workflow-card.component.scss'],
  imports: [TagModule, ButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WorkflowCardComponent {
  props = input.required<WorkflowCardComponentProps>();
}

export interface WorkflowCardComponentProps {
  _id: number;
  workflowName: string;
  workflowDescription: string;
  numOfStages: number;
}
