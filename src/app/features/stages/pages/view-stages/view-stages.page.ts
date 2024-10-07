import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngxs/store';

import {
  StageCardComponent,
} from '@features/stages/components/stage-card/stage-card.component';
import { StagesService } from '@features/stages/services/stages.service';

import { DashboardPageWrapperComponent } from '@shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';

import { AddStageDialogComponent } from '../../components/add-stage-dialog/add-stage-dialog.component';
import { UpdateStageDialogComponent } from '../../components/update-stage-dialog/update-stage-dialog.component';
import { Stage } from '../../models/stage.model';
import { SetStages, SetStagesLoading } from '../../stores/stages-store/stages-data.actions';
import { StagesState } from '../../stores/stages-store/stages.state';

@Component({
  selector: 'app-view-stages-page',
  templateUrl: './view-stages.page.html',
  styleUrls: ['./view-stages.page.scss'],
  standalone: true,
  imports: [
    DashboardPageWrapperComponent,
    StageCardComponent,
    AddStageDialogComponent,
    UpdateStageDialogComponent,
  ],
})
export class ViewStagesPageComponent implements OnInit {
  store = inject(Store);
  stagesService = inject(StagesService);

  visible = signal(false);
  updateModalVisible = signal(false);

  selectedStageToUpdate = signal<Stage | null>(null);

  stages = this.store.selectSignal(StagesState.getStages);
  loading = this.store.selectSignal(StagesState.getStagesLoading);

  ngOnInit(): void {
    this.loadStages();
  }

  loadStages() {
    this.store.dispatch(new SetStagesLoading(true));
    this.stagesService.getAllStagesWithoutPagination().subscribe((data) => {
      this.store.dispatch(new SetStages(data));
      this.store.dispatch(new SetStagesLoading(false));
    });
  }

  

  showAddDialog() {
    return () => {
      this.visible.set(true);
    };
  }

  showUpdateDialog(stage: Stage) {
    return () => {
      this.selectedStageToUpdate.set(stage);
      this.updateModalVisible.set(true);
    };
  }

  constructor() {
    effect(() => {
      if(!this.updateModalVisible()) {
        this.selectedStageToUpdate.set(null);
      }
    }, {allowSignalWrites: true})
  }
}
