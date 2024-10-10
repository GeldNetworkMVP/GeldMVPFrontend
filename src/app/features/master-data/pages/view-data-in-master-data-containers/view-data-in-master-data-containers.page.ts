import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { injectParams } from 'ngxtension/inject-params';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { first } from 'rxjs';

import { eachWordsFirstLetterCapitalized } from '@app/shared/utils/text-utils.utils';

import { DashboardPageWrapperComponent } from '@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

import { UpdateMasterDataContainerDialogComponent } from '../../components/update-master-data-container-dialog/update-master-data-container-dialog.component';
import { MasterDataContainer } from '../../models/master-data-container.model';
import { MasterDataRecord } from '../../models/master-data-record.model';
import { MasterDataService } from '../../services/master-data.service';

interface Column {
  field: string;
  header: string;
}

@Component({
  standalone: true,
  selector: 'app-view-data-in-master-data-containers-page',
  templateUrl: './view-data-in-master-data-containers.page.html',
  styleUrls: ['./view-data-in-master-data-containers.page.scss'],
  imports: [
    DashboardPageWrapperComponent,
    CommonModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    UpdateMasterDataContainerDialogComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewDataInMasterDataContainersPageComponent implements OnInit {
  containerId = injectParams('id');

  masterDataService = inject(MasterDataService);
  router = inject(Router);

  selectedMasterDataContainer = signal<MasterDataContainer | null>(null);
  updateDialogVisible = signal(false);

  masterDataContainerName = computed(() => {
    return this.selectedMasterDataContainer()?.dataname ?? '';
  });

  masterDataFields = computed(() => {
    const rawFields = this.selectedMasterDataContainer()?.mfields ?? [];
    const fields =
      this.containerId() === '66d71f5af2999f18ef9f9d30'
        ? ['templatename', 'contact', 'description', 'location'] // TODO: CHECK IF IT SHOULD BE 'templatename' OR 'collectionname'
        : rawFields;
    return fields;
  });

  columns = computed<Column[]>(() => {
    const c = this.masterDataFields().map((field) => ({
      field,
      header: eachWordsFirstLetterCapitalized(field),
    }));
    c.push({
      field: 'actions',
      header: '',
    });
    return c;
  });

  masterRecords = signal<MasterDataRecord[]>([]);
  loading = signal(false);
  loadingData = signal(false);

  first = signal<number>(0);
  totalRecords = signal(0);
  rows = signal(10);
  page = signal(0);

  handlePagination(event: PaginatorState) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
    this.page.set((event.page ?? 0) + 1);
  }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
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

  constructor() {
    effect(
      () => {
        this.masterRecords.set([]);
        this.loadingData.set(true);
        const dataid = this.containerId() ?? '';
        const fields = this.masterDataFields();
        if (fields.length === 0) {
          return;
        }
        this.masterDataService
          .getAllRecordsPaginatedByContainerId({
            dataid,
            fields,
            limit: this.rows(),
            page: this.page(),
            sort: 1,
          })
          .pipe(first())
          .subscribe({
            next: (data) => {
              console.log(data.Response.content);
              this.masterRecords.set(data.Response.content);
              this.loadingData.set(false);
              this.totalRecords.set(data.Response.PaginationInfo.totalelements);
            },
          });
      },
      { allowSignalWrites: true }
    );
  }

  showDialog() {
    return () => console.log('Show dialog');
  }

  goToCreateRecordPage() {
    return () =>
      this.router.navigate([
        `/dashboard/master-data/${this.containerId()}/new`,
      ]);
  }

  openUpdateDialog() {
    return () => this.updateDialogVisible.set(true);
  }

  goToUpdatePage(record: MasterDataRecord) {
    console.log(record);
    return () => this.router.navigate(
      [`/dashboard/master-data/${this.containerId()}/edit/${record._id}`],
      { state: { record } }
    );
  }
}
