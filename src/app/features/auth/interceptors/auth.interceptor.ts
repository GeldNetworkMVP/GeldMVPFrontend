import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Router } from 'express';

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
    return handle.handle(this.handle(req));
  }

  handle(req: HttpRequest<unknown>) {
    const excludedUrls = [
      '/appuser/save',
      '/userexists',
      '/usersignin',
      '/updateuser',
    ]; // URLs to exclude from prefix and token

    const authToken = localStorage.getItem('token');

    const urlObj = new URL(req.url);
    const origin = urlObj.origin;
    const pathname = urlObj.pathname;

    // Check if the request URL starts with "/api/" and is not excluded
    const shouldAddPrefix = !excludedUrls.some((url) =>
      pathname.startsWith(url)
    );

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
