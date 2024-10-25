import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { first } from 'rxjs';

import { DashboardPageWrapperComponent } from '@app/shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';
import { eachWordsFirstLetterCapitalized } from '@app/shared/utils/text-utils.utils';

import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';

interface Column {
  field: string;
  header: string;
}

@Component({
  standalone: true,
  templateUrl: './view-users.page.html',
  styleUrls: ['./view-users.page.scss'],
  imports: [
    DashboardPageWrapperComponent,
    CommonModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewUsersPageComponent implements OnInit {
  usersService = inject(UsersService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  router = inject(Router);

  selectedUser = signal<User | null>(null);
  updateDialogVisible = signal(false);

  userFields = ['email', 'company', 'designation', 'contact', 'status'];

  columns = computed<Column[]>(() => {
    const c = this.userFields.map((field) => ({
      field,
      header: eachWordsFirstLetterCapitalized(field),
    }));
    c.push({
      field: 'actions',
      header: '',
    });
    return c;
  });

  users = signal<User[]>([]);
  loadingData = signal(false);

  first = signal<number>(0);
  totalRecords = signal(0);
  rows = signal(10);
  page = signal(0);

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.loadingData.set(true);
    this.usersService
      .getAllUsers()
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.users.set(data);
          this.loadingData.set(false);
        },
      });
  }
  showDialog() {
    return () => console.log('Show dialog');
  }

  tryToVerifyUser(rowData: unknown) {
    return () => {
      console.log(rowData);
      this.confirmationService.confirm({
        header: 'Update user status',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: 'p-button-danger p-button-text',
        rejectButtonStyleClass: 'p-button-text p-button-text',
        acceptIcon: 'none',
        rejectIcon: 'none',
        message: 'Are you sure that you want to verify this user?',
        accept: () => {
          this.usersService
            .acceptUser((rowData as User)._id)
            .pipe(first())
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'User verified',
                  detail: 'User verified successfully',
                });
                this.loadRecords();
              },
              error: (err) => {
                console.error(err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'An error occurred while verifying the user',
                });
              },
            });
        },
      });
    };
  }
}
