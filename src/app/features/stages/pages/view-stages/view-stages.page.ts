import { Component, signal } from '@angular/core';

import {
  StageCardComponent,
  StageCardComponentProps,
} from '@features/stages/components/stage-card/stage-card.component';

import { DashboardPageWrapperComponent } from '@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

import { AddStageDialogComponent } from '../../components/add-stage-dialog/add-stage-dialog.component';

@Component({
  selector: 'app-view-stages-page',
  templateUrl: './view-stages.page.html',
  styleUrls: ['./view-stages.page.scss'],
  standalone: true,
  imports: [
    DashboardPageWrapperComponent,
    StageCardComponent,
    AddStageDialogComponent,
  ],
})
export class ViewStagesPageComponent {
  visible = signal(false);
  dummyStages: StageCardComponentProps[] = [
    {
      _id: 1,
      stageNumber: 1,
      stageName: 'Weeding',
      stageDescription: 'Remove weeds from the farm',
      numOfFields: 5,
    },
    {
      _id: 2,
      stageNumber: 2,
      stageName: 'Germination',
      stageDescription: 'Germinate the seeds',
      numOfFields: 10,
    },
    {
      _id: 3,
      stageNumber: 3,
      stageName: 'Harvesting',
      stageDescription: 'Harvest the crops',
      numOfFields: 15,
    },
  ];

  onAddStageClick() {
    console.log('Add stage button clicked');
  }

  showDialog() {
    return () => {
      this.visible.set(true);
    };
  }
}
