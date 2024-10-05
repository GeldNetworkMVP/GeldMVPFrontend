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
import { SaveStageDto } from '@features/stages/dto/save-stage.dto';
import { StagesService } from '@features/stages/services/stages.service';

@Component({
  standalone: true,
  selector: 'app-add-stage-dialog',
  templateUrl: './add-stage-dialog.component.html',
  styleUrls: ['./add-stage-dialog.component.scss'],
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
export class AddStageDialogComponent implements OnInit {
  stagesService = inject(StagesService);
  messageService = inject(MessageService);
  masterDataService = inject(MasterDataService);
  saving = signal(false);


  addStage = output();

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
  addDialogVisibility = signal(false);

  addStageForm = new FormGroup<AddStageForm>({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    fields: new FormArray<AddStageCustomField>([]),
  });

  ngOnInit(): void {
    this.addStageForm.controls.fields.push(this.createGroup());
    this.masterDataService
      .getAllMasterDataContainersWithoutPagination()
      .subscribe((data) => {
        this.masterDataItemOptions.set(data);
      });
  }

  resetForm() {
    this.addStageForm.reset();
    this.addStageForm.controls.fields.clear();
  }

  addCustomField() {
    (this.addStageForm.controls['fields'] as FormArray).push(
      this.createGroup()
    );
  }

  removeCustomField(id: string | undefined) {
    if (id) {
      this.addStageForm.controls.fields.removeAt(
        this.addStageForm.controls.fields.controls.findIndex(
          (control) => control.metadata?.id === id
        )
      );
    }
  }

  onTypeSelect(id: string | undefined, event: DropdownChangeEvent) {
    const valueTypeRaw = event.value as 'text' | 'masterData';
    const formGroup = this.addStageForm.controls.fields.controls.find(
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

  cancelAdding() {
    this.addDialogVisibility.set(false);
    this.resetForm();
  }

  onSubmit() {
    this.saving.set(true);
    console.log('Form submitted ', this.addStageForm.value);
    const value = this.addStageForm.value;
    const formData: SaveStageDto = {
      stagename: value.name as string,
      description: value.description as string,
      fields: (value.fields ?? []).map((field) => ({
        valuekey: field.valuekey as string,
        valuetype: field.valuetype as string,
      })),
    };

    console.log('Form data ', formData);

    this.stagesService.saveStage(formData).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Stage added successfully',
        });
        this.addDialogVisibility.set(false);
        this.resetForm();
        this.addStage.emit();
        this.saving.set(false);
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add stage',
        });
        this.saving.set(false);
      },
    });
  }

  private createControl() {
    const control = new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
    ]);
    control.metadata = {
      id: UUID(),
    };
    return control;
  }

  private createGroup() {
    const formGroup = new FormGroup({
      valuekey: this.createControl(),
      valuetype: this.createControl(),
      valuetyperaw: this.createControl(),
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
