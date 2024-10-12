import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';

import { MasterDataContainer } from '@features/master-data/models/master-data-container.model';

@Component({
  standalone: true,
  selector: 'app-master-data-card',
  templateUrl: './master-data-card.component.html',
  styleUrls: ['./master-data-card.component.scss'],
  imports: [TagModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MasterDataCardComponent {
  props = input.required<MasterDataContainer>();

  router = inject(Router);

  containerSelectedToDelete = output<MasterDataContainer>()


  navigateToMasterDataContainer() {
    this.router.navigate(['/dashboard/master-data', this.props()._id]);
  }

  openDeleteDialog(event: Event) {
    event.stopPropagation();
    this.containerSelectedToDelete.emit(this.props())
  }
}

