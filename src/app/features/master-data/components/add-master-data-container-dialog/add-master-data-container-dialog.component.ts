import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  input,
  OnInit,
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

@Component({
  standalone: true,
  selector: 'app-add-master-data-container-dialog',
  templateUrl: './add-master-data-container-dialog.component.html',
  styleUrls: ['./add-master-data-container-dialog.component.scss'],
  imports: [DialogModule, InputTextModule, ReactiveFormsModule, ButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddMasterDataContainerDialogComponent implements OnInit {
  visible = input.required<WritableSignal<boolean>>();
  addDialogVisibility = signal(false);

  addMasterDataContainerForm = new FormGroup<
    Record<string, FormControl<string | null>>
  >({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
    ]),
  });

  customFields = signal<{ id: string }[]>([{
    id: 'custom-field-0',
  }]);
  numOfCustomFields = computed(() => this.customFields().length);

  ngOnInit(): void {
      this.addMasterDataContainerForm.addControl(
        'custom-field-0',
        new FormControl<string>('', [
          Validators.required,
          Validators.minLength(1),
        ])
      )
  }

  onSubmit() {
    console.log('Form submitted ', this.addMasterDataContainerForm.value);
  }

  resetForm() {
    this.addMasterDataContainerForm.reset();
    this.customFields().forEach((field) => {
      // @ts-expect-error - removeControl's signature is weird
      this.addMasterDataContainerForm.removeControl(field.id);
    });
    this.customFields.set([]);
  }

  addCustomField() {
    const controlName = `custom-field-${this.numOfCustomFields()}`;

    this.addMasterDataContainerForm.addControl(
      controlName,
      new FormControl<string>('', [
        Validators.required,
        Validators.minLength(1),
      ])
    );
    this.customFields.update((fields) => [...fields, { id: controlName }]);
  }

  removeCustomField(id: string) {
    // @ts-expect-error - removeControl's signature is weird
    this.addMasterDataContainerForm.removeControl(id);
    this.customFields.update((fields) =>
      fields.filter((field) => field.id !== id)
    );
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
