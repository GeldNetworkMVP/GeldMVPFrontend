import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { injectParams } from 'ngxtension/inject-params';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { first } from 'rxjs';

import { DashboardPageWrapperComponent } from '@app/shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';
import { commonModules } from '@app/shared/modules/common.modules';
import { eachWordsFirstLetterCapitalized } from '@app/shared/utils/text-utils.utils';

import { UpdateMasterdataRecordDto } from '../../dto/update-masterdata-record.dto';
import { MasterDataContainer } from '../../models/master-data-container.model';
import { MasterDataRecord } from '../../models/master-data-record.model';
import { MasterDataService } from '../../services/master-data.service';

@Component({
  selector: 'app-update-master-record-page',
  templateUrl: './update-master-data-record.page.html',
  styleUrls: ['./update-master-data-record.page.scss'],
  standalone: true,
  imports: [
    DashboardPageWrapperComponent,
    InputTextModule,
    ButtonModule,
    ToastModule,
    ...commonModules,
  ],
})
export class UpdateMasterRecordPageComponent implements OnInit {
  containerId = injectParams('id');
  recordId = injectParams('recordId');

  masterDataService = inject(MasterDataService);
  messageService = inject(MessageService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  selectedMasterDataContainer = signal<MasterDataContainer | null>(null);
  selectedRecord = signal<MasterDataRecord | null>(null);

  masterDataContainerName = computed(() => {
    return this.selectedMasterDataContainer()?.dataname ?? '';
  });

  masterDataFields = computed(() => {
    const fields = this.selectedMasterDataContainer()?.mfields ?? [];
    return fields.filter((field) => field !== '_id');
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
          this.masterDataService
            .getMasterDataRecord(this.recordId() ?? '')
            .pipe(first())
            .subscribe({
              next: (record) => {
                this.selectedRecord.set(record);
                if (record) {
                  this.initForm(record);
                }
                this.loading.set(false);
              },
              error: (err) => {
                console.error(err);
                this.loading.set(false);
              },
            });
        },
      });
  }

  reset() {
    const originalRecord = this.selectedRecord();
    if (originalRecord) {
      this.initForm(originalRecord);
    }
  }

  initForm(record: MasterDataRecord) {
    const keys = Object.keys(record).filter(
      (key) => key !== '_id' && key !== 'dataid'
    );
    keys.forEach((key) => {
      const control = this.formGroup().get(key);
      if (control) {
        control.setValue(record[key]);
      }
    });
  }

  onSubmit() {
    const value = this.formGroup().value;
    const formValue: UpdateMasterdataRecordDto = {
      _id: this.recordId() as string,
      dataobject: {
        dataid: this.selectedRecord()?.dataid as string,
        ...value,
      },
    };

    this.saving.set(true);
    this.masterDataService
      .updateMasterRecord(formValue)
      .pipe(first())
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Record updated',
            detail: 'Record updated successfully',
          });
          this.router.navigate(['/dashboard/master-data', this.containerId()]);
        },
        error: (err) => {
          this.saving.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while updating the record',
          });
          console.error(err);
        },
      });
  }
}
