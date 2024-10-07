import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { Token } from '@app/features/tokens/models/token.model';


@Component({
  standalone: true,
  selector: 'app-marketplace-token-card',
  templateUrl: './marketplace-token-card.component.html',
  styleUrls: ['./marketplace-token-card.component.scss'],
  imports: [TagModule, ButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MarketplaceTokenCardComponent {
  props = input.required<Token>();
}

