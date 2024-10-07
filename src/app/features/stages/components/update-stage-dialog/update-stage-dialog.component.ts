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
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { v4 as UUID } from 'uuid';

import { MasterDataContainer } from '@features/master-data/models/master-data-container.model';
import { MasterDataService } from '@features/master-data/services/master-data.service';
import { StagesService } from '@features/stages/services/stages.service';

import { Stage } from '../../models/stage.model';

@Component({
  standalone: true,
  selector: 'app-update-stage-dialog',
  templateUrl: './update-stage-dialog.component.html',
  styleUrls: ['./update-stage-dialog.component.scss'],
  imports: [
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ToastModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UpdateStageDialogComponent implements OnInit {
  stagesService = inject(StagesService);
  messageService = inject(MessageService);
  masterDataService = inject(MasterDataService);

  selectedStageToUpdate = input<Stage | null>(null);
  updateStage = output();

  saving = signal(false);

  typeOptions: TypeOption[] = [
    {
      name: 'Text',
      key: 'text',
    },
    {
      name: 'Master Data',
      key: 'masterData',
    },
  ];

  masterDataItemOptions = signal<MasterDataContainer[]>([]);

  visible = input.required<WritableSignal<boolean>>();
  updateDialogVisibility = signal(false);

  updateStageForm = new FormGroup<AddStageForm>({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    fields: new FormArray<AddStageCustomField>([]),
  });

  ngOnInit(): void {
    this.masterDataService
      .getAllMasterDataContainersWithoutPagination()
      .subscribe((data) => {
        this.masterDataItemOptions.set(data);
      });
  }

  setFormInitialValues() {
    const stage = this.selectedStageToUpdate();
    if (stage) {
      this.updateStageForm.controls.name.setValue(stage.stagename);
      this.updateStageForm.controls.description.setValue(stage.description);
      this.updateStageForm.controls.fields.clear();
      stage.fields.forEach((field) => {
        const valuetyperaw = field.valuetype === 'text' ? 'text' : 'masterData';
        (this.updateStageForm.controls.fields as FormArray).push(
          this.createGroup({
            valuekey: field.valuekey,
            valuetype: field.valuetype as string,
            valuetyperaw,
          })
        );
      });
    }
  }

  resetForm() {
    this.updateStageForm.reset();
    this.updateStageForm.controls.fields.clear();
  }

  addCustomField() {
    (this.updateStageForm.controls['fields'] as FormArray).push(
      this.createGroup()
    );
  }

  removeCustomField(id: string | undefined) {
    if (id) {
      this.updateStageForm.controls.fields.removeAt(
        this.updateStageForm.controls.fields.controls.findIndex(
          (control) => control.metadata?.id === id
        )
      );
    }
  }

  onTypeSelect(id: string | undefined, event: DropdownChangeEvent) {
    const valueTypeRaw = event.value as 'text' | 'masterData';
    const formGroup = this.updateStageForm.controls.fields.controls.find(
      (control) => control.metadata?.id === id
    );
    if (formGroup) {
      if (valueTypeRaw === 'text') {
        formGroup.controls.valuetype.setValue('text');
      } else {
        formGroup.controls.valuetype.setValue('');
      }
    }
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
        if (this.selectedStageToUpdate()) {
          this.setFormInitialValues();
        }
      },
      { allowSignalWrites: true }
    );
  }

  cancelAdding() {
    this.updateDialogVisibility.set(false);
    this.resetForm();
  }

  onSubmit() {
    this.saving.set(true);
    const value = this.updateStageForm.value;
    const formData: Stage = {
      _id: this.selectedStageToUpdate()?._id as string,
      stagename: value.name as string,
      description: value.description as string,
      fields: (value.fields ?? []).map((field) => ({
        valuekey: field.valuekey as string,
        valuetype: field.valuetype as string,
      })),
    };

    console.log('Form data ', formData);

    this.stagesService.updateStage(formData).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Stage updated successfully',
        });
        this.updateDialogVisibility.set(false);
        this.resetForm();
        this.updateStage.emit();
        this.saving.set(false);
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update stage',
        });
        this.saving.set(false);
      },
    });
  }

  private createControl(value?: string) {
    const control = new FormControl<string>(value ?? '', [
      Validators.required,
      Validators.minLength(1),
    ]);
    control.metadata = {
      id: UUID(),
    };
    return control;
  }

  private createGroup(initialValues?: {
    valuekey?: string;
    valuetype?: string;
    valuetyperaw?: string;
  }) {
    const formGroup = new FormGroup({
      valuekey: this.createControl(initialValues?.valuekey),
      valuetype: this.createControl(initialValues?.valuetype),
      valuetyperaw: this.createControl(initialValues?.valuetyperaw),
    });
    formGroup.metadata = {
      id: UUID(),
    };
    return formGroup;
  }
}

interface TypeOption {
  name: string;
  key: string;
}

interface AddStageForm {
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  fields: FormArray<AddStageCustomField>;
}

type AddStageCustomField = FormGroup<{
  valuekey: FormControl<string | null>;
  valuetyperaw: FormControl<string | null>;
  valuetype: FormControl<string | null>;
}>;
