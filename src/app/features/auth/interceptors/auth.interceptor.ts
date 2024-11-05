import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { SetProfile } from '../stores/auth-store/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  authenticationService = inject(AuthService);
  router = inject(Router);
  store = inject(Store);

  intercept(req: HttpRequest<unknown>, handle: HttpHandler) {
    return handle.handle(this.handle(req)).pipe(
      tap({
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.router.navigate(['/auth/login']);
              this.store.dispatch(new SetProfile(null));
            }
          }
        },
      })
    );
  }

  handle(req: HttpRequest<unknown>) {
    console.log('intercepted request ... ', req);
    const excludedUrls = [
      '/appuser/save',
      '/userexists',
      '/usersignin',
      '/updateuser',
      '/tokens',
      '/tokens/updatestatus',
    ]; // URLs to exclude from prefix and token

    const includedUrls = ['/updateuserstatus']; // URLs to include token

    const authToken = localStorage.getItem('token');

    const urlObj = new URL(req.url);
    const origin = urlObj.origin;
    const pathname = urlObj.pathname;

    // Check if the request URL starts with "/api/" and is not excluded
    const shouldAddPrefix =
      !excludedUrls.some((url) => pathname.startsWith(url)) ||
      includedUrls.some((url) => pathname.startsWith(url));

    let authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });

    if (shouldAddPrefix && authToken) {
      authReq = authReq.clone({ url: `${origin}/api${pathname}` });
    } else if (!authToken) {
      this.router.navigate(['/auth/login']);
      this.store.dispatch(new SetProfile(null));
    }

    return authReq;
  }
}
