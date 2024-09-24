import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  standalone: true,
  selector: 'app-master-data-card',
  templateUrl: './master-data-card.component.html',
  styleUrls: ['./master-data-card.component.scss'],
  imports: [TagModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MasterDataCardComponent {
  props = input.required<MasterDataCardComponentProps>();
}

export interface MasterDataCardComponentProps {
  _id: number;
  name: string;
  numOfRecords: number;
}
