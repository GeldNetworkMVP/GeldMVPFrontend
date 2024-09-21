import { Component } from "@angular/core";

import { DashboardPageWrapperComponent } from "@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component";

@Component({
    selector: 'app-view-workflows-page',
    templateUrl: './view-workflows.page.html',
    styleUrls: ['./view-workflows.page.scss'],
    standalone: true, 
    imports: [DashboardPageWrapperComponent]
})
export class ViewWorkflowsPageComponent {
    onAddWorkflowClick() { 
        console.log('Add stage button clicked');
    }
}