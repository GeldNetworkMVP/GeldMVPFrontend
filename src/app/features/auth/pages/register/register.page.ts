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
import { matchValidator } from '@app/shared/utils/validators.utils';

import { RegisterDto } from '../../dto/register.dto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
export class RegisterPageComponent {
  messageService = inject(MessageService);
  authService = inject(AuthService);
  router = inject(Router);

  checking = signal<boolean>(false);
  submitting = signal<boolean>(false);

  form = new FormGroup(
    {
      name: new FormControl<string | null>(null, [Validators.required]),
      email: new FormControl<string | null>(null, [
        Validators.email,
        Validators.required,
      ]),
      contactNo: new FormControl<string | null>(null, [Validators.required]),
      password: new FormControl<string | null>(null, [Validators.required]),
      confirmPassword: new FormControl<string | null>(null, [
        Validators.required,
      ]),
    },
    { validators: [matchValidator('password', 'confirmPassword')] }
  );

  onSubmit() {
    this.submitting.set(true);
    const formDto: RegisterDto = {
      company: this.form.get('name')?.value as string,
      contact: this.form.get('contactNo')?.value as string,
      designation: 'Geld',
      email: this.form.get('email')?.value as string,
      encpw: this.form.get('password')?.value as string,
      status: 'pending',
    };

    this.authService
      .register(formDto)
      .pipe(first())
      .subscribe({
        next: (response) => {
          console.log(response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Register successful',
          });
          this.submitting.set(false);
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred',
          });
          this.submitting.set(false);
        },
      });
  }
}
