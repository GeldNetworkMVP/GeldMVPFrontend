import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { ToastModule } from 'primeng/toast';

import { StagesService } from '@features/stages/services/stages.service';
import { WorkflowsService } from '@features/workflows/services/workflows.service';

import { Workflow } from '../../models/workflow.model';

@Component({
  standalone: true,
  selector: 'app-update-workflow-dialog',
  templateUrl: './update-workflow-dialog.component.html',
  styleUrls: ['./update-workflow-dialog.component.scss'],
  imports: [
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    OrderListModule,
    ToastModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UpdateWorkflowDialogComponent implements OnInit {
  stagesService = inject(StagesService);
  workflowsService = inject(WorkflowsService);
  messageService = inject(MessageService);

  stageOptions = signal<StageOption[]>([]);
  saving = signal(false);
  updateDialogVisibility = signal(false);

  visible = input.required<WritableSignal<boolean>>();

  selectedWorkflowToUpdate = input<Workflow | null>(null);
  updateWorkflow = output();

  addWorkflowForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    description: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    stages: new FormControl<string[]>([], [Validators.required]),
  });

  resetForm() {
    this.addWorkflowForm.reset();
  }

  constructor() {
    effect(
      () => {
        this.updateDialogVisibility.set(this.visible()());
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        this.visible().set(this.updateDialogVisibility());
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (this.selectedWorkflowToUpdate()) {
          this.initFormValues();
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.loadStageOptions();
  }

  initFormValues() {
    const workflow = this.selectedWorkflowToUpdate();
    if (workflow) {
      this.addWorkflowForm.controls.name.setValue(workflow.workflowname);
      this.addWorkflowForm.controls.description.setValue(workflow.description);
      this.addWorkflowForm.controls.stages.setValue(workflow.stages);
    }
  }

  loadStageOptions() {
    this.stagesService.getAllStagesWithoutPagination().subscribe((stages) => {
      this.stageOptions.set(
        stages.map((stage) => ({
          name: stage.stagename,
        }))
      );
    });
  }

  onSubmit() {
    this.saving.set(true);
    const value = this.addWorkflowForm.value;
    const formData: Workflow = {
      _id: this.selectedWorkflowToUpdate()?._id as string,
      workflowname: value.name as string,
      description: value.description as string,
      stages: value.stages as string[],
    };

    // TODO: REMEMBER TO ADD USER ID LATER

    this.workflowsService.updateWorkflow(formData).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Workflow updated successfully',
        });
        this.updateDialogVisibility.set(false);
        this.resetForm();
        this.saving.set(false);
        this.updateWorkflow.emit();
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update workflow',
        });
        this.saving.set(false);
      },
    });
  }

  cancelAdding() {
    this.updateDialogVisibility.set(false);
    this.resetForm();
  }
}

interface StageOption {
  name: string;
}
