import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {SkeletonModule} from 'primeng/skeleton'
import { ToastModule } from 'primeng/toast';

import { AddWorkflowDialogComponent } from '@features/workflows/components/add-workflow-dialog/add-workflow-dialog.component';
import { WorkflowCardComponent } from '@features/workflows/components/workflow-card/workflow-card.component';
import { Workflow } from '@features/workflows/models/workflow.model';
import { WorkflowsService } from '@features/workflows/services/workflows.service';

import { DashboardPageWrapperComponent } from '@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

import { UpdateWorkflowDialogComponent } from '../../components/update-workflow-dialog/update-workflow-dialog.component';

@Component({
  selector: 'app-view-workflows-page',
  templateUrl: './view-workflows.page.html',
  styleUrls: ['./view-workflows.page.scss'],
  standalone: true,
  imports: [
    DashboardPageWrapperComponent,
    WorkflowCardComponent,
    AddWorkflowDialogComponent,
    UpdateWorkflowDialogComponent,
    ToastModule,
    SkeletonModule,
    ConfirmDialogModule,
  ],
})
export class ViewWorkflowsPageComponent implements OnInit {
  workflowsService = inject(WorkflowsService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  workflows = signal<Workflow[]>([]);

  visible = signal(false);
  loading = signal(false);

  selectedWorkflowToUpdate = signal<Workflow | null>(null);
  updateModalVisible = signal(false);

  skeletons = [1, 2, 3, 4, 5, 6]

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

  showUpdateDialog(workflow: Workflow) {
    return () => {
      this.selectedWorkflowToUpdate.set(workflow);
      this.updateModalVisible.set(true);
    };
  }

  constructor() {
    effect(
      () => {
        if (!this.updateModalVisible()) {
          this.selectedWorkflowToUpdate.set(null);
        }
      },
      { allowSignalWrites: true }
    );
  }

  confirmDelete(workflow: Workflow) {
    this.confirmationService.confirm({
      message: `Do you want to delete '${workflow.workflowname}' workflow?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.workflowsService.removeWorkflowById(workflow._id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Stage deleted successfully',
            });
            this.loadWorkflows();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete workflow',
            });
          },
        });
      },
    });
  }
}
