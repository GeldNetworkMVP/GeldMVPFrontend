import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { injectParams } from 'ngxtension/inject-params';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { first } from 'rxjs';

import { DashboardPageWrapperComponent } from '@app/shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';
import { commonModules } from '@app/shared/modules/common.modules';
import { eachWordsFirstLetterCapitalized } from '@app/shared/utils/text-utils.utils';

import { SaveMasterdataRecordDto } from '../../dto/save-masterdata-record.dto';
import { MasterDataContainer } from '../../models/master-data-container.model';
import { MasterDataService } from '../../services/master-data.service';

@Component({
  selector: 'app-create-master-record-page',
  templateUrl: './create-master-data-record.page.html',
  styleUrls: ['./create-master-data-record.page.scss'],
  standalone: true,
  imports: [
    DashboardPageWrapperComponent,
    InputTextModule,
    ButtonModule,
    ToastModule,
    ...commonModules,
  ],
})
export class CreateMasterRecordPageComponent implements OnInit {
  containerId = injectParams('id');
  masterDataService = inject(MasterDataService);
  messageService = inject(MessageService);
  router = inject(Router);


  selectedMasterDataContainer = signal<MasterDataContainer | null>(null);

  masterDataContainerName = computed(() => {
    return this.selectedMasterDataContainer()?.dataname ?? '';
  });

  masterDataFields = computed(() => {
    const rawFields = this.selectedMasterDataContainer()?.mfields ?? [];
    return rawFields.filter((field) => field !== '_id');
  });

  formMetadata = computed(() => {
    return this.masterDataFields().map((field) => ({
      id: field,
      name: field,
      label: eachWordsFirstLetterCapitalized(field),
    }));
  });

  formGroup = computed(() => {
    const group = new FormGroup<Record<string, FormControl<string | null>>>({});
    this.masterDataFields().forEach((field) => {
      group.addControl(
        field,
        new FormControl('', [Validators.required, Validators.minLength(1)])
      );
    });
    return group;
  });

  saving = signal(false);
  loading = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.masterDataService
      .getMasterDataContainer(this.containerId() ?? '')
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.selectedMasterDataContainer.set(data.Response);
          this.loading.set(false);
        },
      });
  }

  onSubmit() {
    const formValue: SaveMasterdataRecordDto = {
      dataid: this.containerId() as string,
      ...this.formGroup().value,
      // templatename: this.formGroup().value['collectionname'] as string,
    };
    // delete formValue['collectionname'];
    this.saving.set(true);
    this.masterDataService
      .saveMasterRecord(formValue)
      .pipe(first())
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Record saved',
            detail: 'Record saved successfully',
          });
          this.router.navigate(['/dashboard/master-data', this.containerId()]);
        },
        error: (err) => {
          this.saving.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while saving the record',
          });
          console.error(err);
        },
      });
  }
}
