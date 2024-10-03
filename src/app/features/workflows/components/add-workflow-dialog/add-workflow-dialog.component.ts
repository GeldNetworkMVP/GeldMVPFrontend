import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';

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
    ReactiveFormsModule,
    ButtonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddWorkflowDialogComponent {
  stageOptions: StageOption[] = [
    {
      name: 'Weeding',
    },
    {
      name: 'Germination',
    },
    {
      name: 'Harvesting',
    },
  ];

  visible = input.required<WritableSignal<boolean>>();
  addDialogVisibility = signal(false);

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

  onSubmit() {
    console.log('Form submitted ', this.addWorkflowForm.value);
  }

  resetForm() {
    this.addWorkflowForm.reset();
  }

  removeCustomField(id: string) {
    console.log('Removing custom field with id: ', id);
    // this.addWorkflowForm.removeControl(id);
    // this.customFields.update((fields) =>
    //   fields.filter((field) => field.id !== id)
    // );
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
}

interface StageOption {
  name: string;
}
