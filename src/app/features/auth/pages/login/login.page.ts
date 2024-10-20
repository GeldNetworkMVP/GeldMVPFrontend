import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { first } from 'rxjs';

import { DashboardPageWrapperComponent } from '@app/shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';
import { commonModules } from '@app/shared/modules/common.modules';

import { SignInDto } from '../../dto/sign-in.dto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    DashboardPageWrapperComponent,
    InputTextModule,
    ButtonModule,
    ToastModule,
    InputTextareaModule,
    DropdownModule,
    RouterLink,
    ...commonModules,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginPageComponent {
  messageService = inject(MessageService);
  authService = inject(AuthService);
  router = inject(Router);

  checking = signal<boolean>(false);
  submitting = signal<boolean>(false);

  form = new FormGroup({
    email: new FormControl<string | null>(null, [
      Validators.email,
      Validators.required,
    ]),
    password: new FormControl<string | null>(null, [Validators.required]),
  });

  onSubmit() {
    this.submitting.set(true);
    const formDto: SignInDto = {
      email: this.form.get('email')?.value as string,
      pw: this.form.get('password')?.value as string,
    };

    this.authService.login(formDto).pipe(first()).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful',
        });
        this.submitting.set(false);
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred',
        });
        this.submitting.set(false);
      }
    });
  }
}
