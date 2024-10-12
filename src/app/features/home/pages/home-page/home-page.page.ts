import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ButtonModule, RouterLink],
})
export class HomePageComponent {}
