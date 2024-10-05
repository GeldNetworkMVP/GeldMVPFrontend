import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { injectParams } from 'ngxtension/inject-params';

import { DashboardPageWrapperComponent } from '@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

import { MasterDataState } from '../../stores/master-data-store/master-data.state';

@Component({
  standalone: true,
  selector: 'app-view-data-in-master-data-containers-page',
  templateUrl: './view-data-in-master-data-containers.page.html',
  styleUrls: ['./view-data-in-master-data-containers.page.scss'],
  imports: [DashboardPageWrapperComponent],
})
export class ViewDataInMasterDataContainersPageComponent {
  containerId = injectParams('id');
  store = inject(Store);
  masterDataContainers = this.store.selectSignal(MasterDataState.getMasterData);

  selectedMasterDataContainer = computed(() => {
    return this.masterDataContainers().find(
      (container) => container._id === this.containerId()
    );
  })

  masterDataContainerName = computed(() => {
    return this.selectedMasterDataContainer()?.dataname ?? '';
  })

  showDialog() {
    return () => console.log('Show dialog');
  }
}
