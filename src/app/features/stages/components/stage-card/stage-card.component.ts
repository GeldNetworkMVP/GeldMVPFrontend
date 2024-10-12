import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { Stage } from '@features/stages/models/stage.model';

@Component({
  standalone: true,
  selector: 'app-stage-card',
  templateUrl: './stage-card.component.html',
  styleUrls: ['./stage-card.component.scss'],
  imports: [TagModule, ButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StageCardComponent {
  props = input.required<Stage>();
  index = input.required<number>();

  stageSelectedToUpdate = output<Stage>()
  stageSelectedToDelete = output<Stage>()

  num = computed(() => this.index() + 1);
  numOfFields = computed(() => this.props().fields.length);

  updateModalVisible = signal(false);

  openEditDialog() {
    this.updateModalVisible.set(true);
    this.stageSelectedToUpdate.emit(this.props())
  }

  openDeleteDialog() {
    this.stageSelectedToDelete.emit(this.props())
  }

}
