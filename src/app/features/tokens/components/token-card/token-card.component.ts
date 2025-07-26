import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { Token } from '../../models/token.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  standalone: true,
  selector: 'app-token-card',
  templateUrl: './token-card.component.html',
  styleUrls: ['./token-card.component.scss'],
  imports: [TagModule, ButtonModule, CommonModule, DialogModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TokenCardComponent {
  props = input.required<Token>();
   displayDialog = false;
  fileUrl: SafeResourceUrl | null = null;;

    constructor(private sanitizer: DomSanitizer) {}

  showDialog() {
    const cid = this.props()?.cid;
     console.log('CID:', cid);
    if (!cid) {
      console.error('CID is undefined or null');
      return;
    }

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://geld-network-secure.myfilebase.com/ipfs/${cid}`
    );

    this.displayDialog = true;
  }
}

