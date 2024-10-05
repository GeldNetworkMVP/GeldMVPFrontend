import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  input,
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
import { ToastModule } from 'primeng/toast';

import { SaveMasterDataContainerDto } from '@features/master-data/dto/save-masterdata-container.dto';
import { MasterDataService } from '@features/master-data/services/master-data.service';

@Component({
  standalone: true,
  selector: 'app-add-master-data-container-dialog',
  templateUrl: './add-master-data-container-dialog.component.html',
  styleUrls: ['./add-master-data-container-dialog.component.scss'],
  imports: [
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddMasterDataContainerDialogComponent {
  masterDataService = inject(MasterDataService);
  messageService = inject(MessageService);

  visible = input.required<WritableSignal<boolean>>();
  addDialogVisibility = signal(false);
  addNewMasterData = output();

  addMasterDataContainerForm = new FormGroup<{
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    [key: string]: FormControl<string | null>;
  }>({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    description: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    'custom-field-0': new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
    ]),
  });

  customFields = signal<{ id: string }[]>([
    {
      id: 'custom-field-0',
    },
  ]);
  numOfCustomFields = computed(() => this.customFields().length);

  saving = signal(false);

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

  onSubmit() {
    this.saving.set(true);
    const customFields = Object.keys(
      this.addMasterDataContainerForm.value
    ).filter((key) => key.startsWith('custom-field'));

    const mfields = customFields.map(
      (key) => this.addMasterDataContainerForm.value[key]
    ) as string[];
    if (!mfields.includes('collectionname')) {
      mfields.push('collectionname');
    }

    const formData: SaveMasterDataContainerDto = {
      dataname: this.addMasterDataContainerForm.value.name as string,
      description: this.addMasterDataContainerForm.value.description as string,
      mfields,
    };

    this.masterDataService.saveMasterDataContainer(formData).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Master data container added successfully',
        });
        this.addDialogVisibility.set(false);
        this.resetForm();
        this.saving.set(false);
        this.addNewMasterData.emit();
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add master data container',
        });
        this.saving.set(false);
      },
    });
  }
}
