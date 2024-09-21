import { Component } from "@angular/core";

import { DashboardPageWrapperComponent } from "@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component";

@Component({
    selector: 'app-view-master-data-page',
    templateUrl: './view-master-data.page.html',
    styleUrls: ['./view-master-data.page.scss'],
    standalone: true,
    imports: [DashboardPageWrapperComponent]
})
export class ViewMasterDataPageComponent {
    onAddMasterDataButtonClick() { 
        console.log('Add Master Data button clicked');
    }
}