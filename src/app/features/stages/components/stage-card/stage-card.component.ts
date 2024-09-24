import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  standalone: true,
  selector: 'app-stage-card',
  templateUrl: './stage-card.component.html',
  styleUrls: ['./stage-card.component.scss'],
  imports: [TagModule, ButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StageCardComponent {
  props = input.required<StageCardComponentProps>();
}

export interface StageCardComponentProps {
  _id: number;
  stageNumber: number;
  stageName: string;
  stageDescription: string;
  numOfFields: number;
}
