import {
  Component,
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

import { UpdateMasterDataContainerDto } from '@features/master-data/dto/save-masterdata-container.dto';
import { MasterDataService } from '@features/master-data/services/master-data.service';

import { MasterDataContainer } from '../../models/master-data-container.model';

@Component({
  standalone: true,
  selector: 'app-update-master-data-container-dialog',
  templateUrl: './update-master-data-container-dialog.component.html',
  styleUrls: ['./update-master-data-container-dialog.component.scss'],
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
export class UpdateMasterDataContainerDialogComponent {
  masterDataService = inject(MasterDataService);
  messageService = inject(MessageService);

  visible = input.required<WritableSignal<boolean>>();
  selectedContainerToUpdate = input<MasterDataContainer | null>();

  updateDialogVisibility = signal(false);
  updateMasterData = output();

  updateMasterDataContainerForm = new FormGroup<{
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    // TODO: CONSIDER LATER
    // [key: string]: FormControl<string | null>;
  }>({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    description: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    // TODO: CONSIDER LATER
    // 'custom-field-0': new FormControl<string>('', [
    //   Validators.required,
    //   Validators.minLength(1),
    // ]),
  });

  // customFields = signal<{ id: string }[]>([
  //   {
  //     id: 'custom-field-0',
  //   },
  // ]);
  // numOfCustomFields = computed(() => this.customFields().length);

  saving = signal(false);

  initForm() {
    this.updateMasterDataContainerForm.setValue({
      name: this.selectedContainerToUpdate()?.dataname ?? '',
      description: this.selectedContainerToUpdate()?.description ?? '',
    });
  }

  resetForm() {
    this.updateMasterDataContainerForm.reset();
    // this.customFields().forEach((field) => {
    //   // @ts-expect-error - removeControl's signature is weird
    //   this.updateMasterDataContainerForm.removeControl(field.id);
    // });
    // this.customFields.set([]);
  }

  // TODO: CONSIDER LATER
  // addCustomField() {
  //   const controlName = `custom-field-${this.numOfCustomFields()}`;

  //   this.updateMasterDataContainerForm.addControl(
  //     controlName,
  //     new FormControl<string>('', [
  //       Validators.required,
  //       Validators.minLength(1),
  //     ])
  //   );
  //   this.customFields.update((fields) => [...fields, { id: controlName }]);
  // }

  // removeCustomField(id: string) {
  //   // @ts-expect-error - removeControl's signature is weird
  //   this.updateMasterDataContainerForm.removeControl(id);
  //   this.customFields.update((fields) =>
  //     fields.filter((field) => field.id !== id)
  //   );
  // }

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

    effect(() => {
      if (this.selectedContainerToUpdate()) {
        this.initForm();
      }
    });
  }

  cancelAdding() {
    this.updateDialogVisibility.set(false);
    this.resetForm();
  }

  onSubmit() {
    this.saving.set(true);
    // TODO: CONSIDER LATER
    // const customFields = Object.keys(
    //   this.updateMasterDataContainerForm.value
    // ).filter((key) => key.startsWith('custom-field'));

    // const mfields = customFields.map(
    //   (key) => this.updateMasterDataContainerForm.value[key]
    // ) as string[];
    // if (!mfields.includes('collectionname')) {
    //   mfields.push('collectionname');
    // }

    const formData: UpdateMasterDataContainerDto = {
      _id: this.selectedContainerToUpdate()?._id as string,
      dataname: this.updateMasterDataContainerForm.value.name as string,
      description: this.updateMasterDataContainerForm.value
        .description as string,
      // TODO: CONSIDER LATER
      // mfields,
    };

    this.masterDataService.updateMasterDataContainer(formData).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Master data container updated successfully',
        });
        this.updateDialogVisibility.set(false);
        this.resetForm();
        this.saving.set(false);
        this.updateMasterData.emit();
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update master data container',
        });
        this.saving.set(false);
      },
    });
  }
}
