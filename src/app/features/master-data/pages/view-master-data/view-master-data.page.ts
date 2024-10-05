import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { DialogModule } from 'primeng/dialog';
import { FocusTrapModule } from 'primeng/focustrap';
import { first } from 'rxjs';

import { AddMasterDataContainerDialogComponent } from '@features/master-data/components/add-master-data-container-dialog/add-master-data-container-dialog.component';
import { MasterDataCardComponent } from '@features/master-data/components/master-data-card/master-data-card.component';
import { MasterDataService } from '@features/master-data/services/master-data.service';

import { DashboardPageWrapperComponent } from '@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

import { SetMasterDataContainers, SetMasterDataContainersLoading } from '../../stores/master-data-store/master-data.actions';
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
  ],
})
export class ViewMasterDataPageComponent implements OnInit {
  store = inject(Store);
  masterDataService = inject(MasterDataService);

  visible = signal(false);
  dummyMasterData = [
    { _id: 1, name: 'Farmers', numOfRecords: 10 },
    { _id: 2, name: 'Processing Centers', numOfRecords: 5 },
  ];
  masterData = this.store.selectSignal(MasterDataState.getMasterData);
  loading = this.store.selectSignal(MasterDataState.getMasterDataLoading);

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
}
