import { Component, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FocusTrapModule } from 'primeng/focustrap';

import { AddMasterDataContainerDialogComponent } from '@features/master-data/components/add-master-data-container-dialog/add-master-data-container-dialog.component';
import { MasterDataCardComponent } from '@features/master-data/components/master-data-card/master-data-card.component';

import { DashboardPageWrapperComponent } from '@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

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
    AddMasterDataContainerDialogComponent
  ],
})
export class ViewMasterDataPageComponent {
  visible = signal(false);
  dummyMasterData = [
    { _id: 1, name: 'Farmers', numOfRecords: 10 },
    { _id: 2, name: 'Processing Centers', numOfRecords: 5 },
  ];

  onAddMasterDataButtonClick() {
    console.log('Add Master Data button clicked');
  }

  showDialog() {
    return  () => {
      this.visible.set(true);
    }
  }
}
