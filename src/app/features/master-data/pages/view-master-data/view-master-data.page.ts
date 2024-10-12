import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FocusTrapModule } from 'primeng/focustrap';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { first } from 'rxjs';

import { AddMasterDataContainerDialogComponent } from '@features/master-data/components/add-master-data-container-dialog/add-master-data-container-dialog.component';
import { MasterDataCardComponent } from '@features/master-data/components/master-data-card/master-data-card.component';
import { MasterDataService } from '@features/master-data/services/master-data.service';

import { DashboardPageWrapperComponent } from '@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

import { MasterDataContainer } from '../../models/master-data-container.model';
import {
  SetMasterDataContainers,
  SetMasterDataContainersLoading,
} from '../../stores/master-data-store/master-data.actions';
import { MasterDataState } from '../../stores/master-data-store/master-data.state';

@Component({
  selector: 'app-view-master-data-page',
  templateUrl: './view-master-data.page.html',
  styleUrls: ['./view-master-data.page.scss'],
  standalone: true,
  imports: [
    DashboardPageWrapperComponent,
    MasterDataCardComponent,
    DialogModule,
    FocusTrapModule,
    AddMasterDataContainerDialogComponent,
    ToastModule,
    SkeletonModule,
    ConfirmDialogModule,
  ],
})
export class ViewMasterDataPageComponent implements OnInit {
  store = inject(Store);
  masterDataService = inject(MasterDataService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  visible = signal(false);
  dummyMasterData = [
    { _id: 1, name: 'Farmers', numOfRecords: 10 },
    { _id: 2, name: 'Processing Centers', numOfRecords: 5 },
  ];
  masterData = this.store.selectSignal(MasterDataState.getMasterData);
  loading = this.store.selectSignal(MasterDataState.getMasterDataLoading);

  skeletons = [1, 2, 3, 4, 5, 6]

  ngOnInit() {
    this.loadMasterData();
  }

  loadMasterData() {
    this.store.dispatch(new SetMasterDataContainersLoading(true));
    this.masterDataService
      .getAllMasterDataContainersWithoutPagination()
      .pipe(first())
      .subscribe((data) => {
        this.store.dispatch(new SetMasterDataContainers(data));
        this.store.dispatch(new SetMasterDataContainersLoading(false));
      });
  }
  showDialog() {
    return () => {
      this.visible.set(true);
    };
  }

  confirmDelete(container: MasterDataContainer) {
    this.confirmationService.confirm({
      message: `Do you want to delete '${container.dataname}' container? Note that all the data in this container will be lost.`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.masterDataService
          .removeMasterDataContainer(container._id)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Container deleted successfully',
              });
              this.loadMasterData();
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete container',
              });
            },
          });
      },
    });
  }
}
