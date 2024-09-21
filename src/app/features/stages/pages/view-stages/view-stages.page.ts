import { Component } from "@angular/core";

import { DashboardPageWrapperComponent } from "@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component";

@Component({
    selector: 'app-view-stages-page',
    templateUrl: './view-stages.page.html',
    styleUrls: ['./view-stages.page.scss'],
    standalone: true,
    imports: [DashboardPageWrapperComponent]
})
export class ViewStagesPageComponent {
    onAddStageClick() { 
        console.log('Add stage button clicked');
    }
}