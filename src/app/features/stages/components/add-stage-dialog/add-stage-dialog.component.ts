import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  input,
  OnInit,
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
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { v4 as UUID } from 'uuid';

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
    ReactiveFormsModule,
    ButtonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddStageDialogComponent implements OnInit {
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

  masterDataItemOptions: MasterDataItem[] = [
    {
      name: 'Farmers',
      _id: UUID(),
    },
    {
      name: 'Processing Centers',
      _id: UUID(),
    },
  ];

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
  }

  onSubmit() {
    console.log('Form submitted ', this.addStageForm.value);
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

interface MasterDataItem {
  name: string;
  _id: string;
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
