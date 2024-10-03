import { Component, signal } from '@angular/core';

import { AddWorkflowDialogComponent } from '@features/workflows/components/add-workflow-dialog/add-workflow-dialog.component';
import {
  WorkflowCardComponent,
  WorkflowCardComponentProps,
} from '@features/workflows/components/workflow-card/workflow-card.component';

import { DashboardPageWrapperComponent } from '@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

@Component({
  selector: 'app-view-workflows-page',
  templateUrl: './view-workflows.page.html',
  styleUrls: ['./view-workflows.page.scss'],
  standalone: true,
  imports: [
    DashboardPageWrapperComponent,
    WorkflowCardComponent,
    AddWorkflowDialogComponent,
  ],
})
export class ViewWorkflowsPageComponent {
  visible = signal(false);

  dummyWorkflows: WorkflowCardComponentProps[] = [
    {
      _id: 1,
      workflowName: 'Weeding',
      workflowDescription:
        'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      numOfStages: 5,
    },
    {
      _id: 2,
      workflowName: 'Germination',
      workflowDescription:
        'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      numOfStages: 10,
    },
    {
      _id: 3,
      workflowName: 'Harvesting',
      workflowDescription:
        'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      numOfStages: 15,
    },
  ];
  onAddWorkflowClick() {
    console.log('Add stage button clicked');
  }

  showDialog() {
    return () => {
      this.visible.set(true);
    };
  }
}
