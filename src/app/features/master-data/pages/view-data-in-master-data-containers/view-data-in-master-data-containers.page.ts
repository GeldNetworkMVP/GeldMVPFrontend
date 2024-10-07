import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { injectParams } from 'ngxtension/inject-params';
import { TableModule } from 'primeng/table';
import { first } from 'rxjs';

import { DashboardPageWrapperComponent } from '@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

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
  imports: [DashboardPageWrapperComponent, CommonModule, TableModule],
})
export class ViewDataInMasterDataContainersPageComponent implements OnInit {
  containerId = injectParams('id');

  masterDataService = inject(MasterDataService);
  router = inject(Router);


  selectedMasterDataContainer = signal<MasterDataContainer | null>(null);

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
      header: field,
    }));
    console.log(c);
    return c;
  });

  masterRecords = signal<MasterDataRecord[]>([]);
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

  constructor() {
    effect(
      () => {
        this.loading.set(true);
        const dataid = this.containerId() ?? '';
        const fields = this.masterDataFields();
        this.masterDataService
          .getAllRecordsPaginatedByContainerId({
            dataid,
            fields,
            limit: 100,
            page: 1,
            sort: 1,
          })
          .pipe(first())
          .subscribe({
            next: (data) => {
              console.log(data.Response.content);
              this.masterRecords.set(data.Response.content);
              this.loading.set(false);
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
}
