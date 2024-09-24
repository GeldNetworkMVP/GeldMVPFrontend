import { Component } from '@angular/core';

import { MasterDataCardComponent } from '@features/master-data/components/master-data-card/master-data-card.component';

import { DashboardPageWrapperComponent } from '@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

@Component({
  selector: 'app-view-master-data-page',
  templateUrl: './view-master-data.page.html',
  styleUrls: ['./view-master-data.page.scss'],
  standalone: true,
  imports: [DashboardPageWrapperComponent, MasterDataCardComponent],
})
export class ViewMasterDataPageComponent {
  dummyMasterData = [
    { _id: 1, name: 'Farmers', numOfRecords: 10 },
    { _id: 2, name: 'Processing Centers', numOfRecords: 5 },
  ];

  onAddMasterDataButtonClick() {
    console.log('Add Master Data button clicked');
  }
}
