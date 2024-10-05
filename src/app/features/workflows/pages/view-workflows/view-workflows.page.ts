import { Component, inject, OnInit, signal } from '@angular/core';

import { AddWorkflowDialogComponent } from '@features/workflows/components/add-workflow-dialog/add-workflow-dialog.component';
import {
  WorkflowCardComponent,
} from '@features/workflows/components/workflow-card/workflow-card.component';
import { Workflow } from '@features/workflows/models/workflow.model';
import { WorkflowsService } from '@features/workflows/services/workflows.service';

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
export class ViewWorkflowsPageComponent implements OnInit {
  workflowsService = inject(WorkflowsService);

  workflows = signal<Workflow[]>([]);

  visible = signal(false);
  loading = signal(false);

  ngOnInit(): void {
    this.loadWorkflows();
  }

  loadWorkflows() {
    this.loading.set(true);
    this.workflowsService
      .getAllWorkflowsWithoutPagination()
      .subscribe((data) => {
        this.workflows.set(data);
        this.loading.set(false);
      });
  }

  onAddWorkflowClick() {
    console.log('Add stage button clicked');
  }

  showDialog() {
    return () => {
      this.visible.set(true);
    };
  }
}
