import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { first, Subject, takeUntil } from 'rxjs';

import { Plot } from '@app/features/master-data/models/plot.model';
import { MasterDataService } from '@app/features/master-data/services/master-data.service';
import { DashboardPageWrapperComponent } from '@app/shared/components/dashboard-page-wrapper/dashboard-page-wrapper.component';
import { commonModules } from '@app/shared/modules/common.modules';

import { SaveTokenDto } from '../../dto/save-token.dto';
import { TokensService } from '../../services/tokens.service';

@Component({
  selector: 'app-create-token-page',
  templateUrl: './create-token.page.html',
  styleUrls: ['./create-token.page.scss'],
  standalone: true,
  imports: [
    DashboardPageWrapperComponent,
    InputTextModule,
    ButtonModule,
    ToastModule,
    InputTextareaModule,
    DropdownModule,
    ...commonModules,
  ],
})
export class CreateTokenPageComponent implements OnInit, OnDestroy {
  messageService = inject(MessageService);
  masterDataService = inject(MasterDataService);
  tokensService = inject(TokensService);
  router = inject(Router);

  destroy = new Subject<void>();

  plots = signal<Plot[]>([]);
  saving = signal<boolean>(false);

  formGroup = new FormGroup({
    plot: new FormControl<string | null>(null, [Validators.required]),
    tokenName: new FormControl<string | null>(null, [Validators.required]),
    price: new FormControl<string | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    description: new FormControl<string | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    this.masterDataService
      .getAllPlots()
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (value) => {
          this.plots.set(value.Response);
        },

        error(error) {
          console.error(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  onSelectPlot(event: DropdownChangeEvent) {
    const value = event.value as string;
    this.tokensService
      .getTransactionsBasedOnPlotId(value)
      .pipe(first())
      .subscribe({
        next: (value) => {
          if (value) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Plot already has a token',
            });
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onGenerateBtnClick() {
    return () => {
      if (this.formGroup.invalid) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please fill all the fields',
        });
      } else {
        this.saving.set(true);
        const value = this.formGroup.value;

        const dto: SaveTokenDto = {
          plotid: value.plot as string,
          tokenname: value.tokenName as string,
          description: value.description as string,
          price: value.price as string,
          filetype: 'html', // TODO: CHECK IF THIS IS REQUIRED,
          bcstatus: 'onsale', // TODO: CHECK THIS LATER
          bchash: null, // TODO: CHECK THIS LATER
        };

        this.tokensService
          .saveToken(dto)
          .pipe(first())
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Token created successfully',
              });
              this.formGroup.reset();
              this.router.navigate(['/dashboard/tokens']);
              this.saving.set(false);
            },
            error: (error) => {
              console.log(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to create token',
              });
              this.saving.set(false);
            },
          });
      }
    };
  }
}
