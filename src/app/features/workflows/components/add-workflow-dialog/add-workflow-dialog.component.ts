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
import { SaveWorkflowDto } from '@features/workflows/dto/save-workflow.dto';
import { WorkflowsService } from '@features/workflows/services/workflows.service';

@Component({
  standalone: true,
  selector: 'app-add-workflow-dialog',
  templateUrl: './add-workflow-dialog.component.html',
  styleUrls: ['./add-workflow-dialog.component.scss'],
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
export class AddWorkflowDialogComponent implements OnInit {
  stagesService = inject(StagesService);
  workflowsService = inject(WorkflowsService);
  messageService = inject(MessageService);

  stageOptions = signal<StageOption[]>([]);
  saving = signal(false);
  addDialogVisibility = signal(false);


  visible = input.required<WritableSignal<boolean>>();
  addWorkflow = output();

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
        this.addDialogVisibility.set(this.visible()());
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        this.visible().set(this.addDialogVisibility());
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.loadStageOptions();
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
    const formData: SaveWorkflowDto = {
      workflowname: value.name as string,
      description: value.description as string,
      stages: value.stages as string[],
    };

    // TODO: REMEMBER TO ADD USER ID LATER

    this.workflowsService.saveWorkflow(formData).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Workflow added successfully',
        });
        this.addDialogVisibility.set(false);
        this.resetForm();
        this.saving.set(false);
        this.addWorkflow.emit();
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add workflow',
        });
        this.saving.set(false);
      },
    });
  }

  cancelAdding() {
    this.addDialogVisibility.set(false);
    this.resetForm();
  }
}

interface StageOption {
  name: string;
}
