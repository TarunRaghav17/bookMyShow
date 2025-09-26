import { AuthService } from './../auth-service.service';
import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { LoaderService } from '../../services/loader.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private authService: AuthService,
    private loaderService: LoaderService
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const bypassLoader = req.context.get(this.loaderService.NO_LOADER)
    if (bypassLoader) {
      this.loaderService.showLoader();
    }
    const shouldBypass = req.context.get(this.commonService.IS_PUBLIC_API);
    let authReq = req;
    if (!shouldBypass) {
      const authToken = localStorage.getItem('token');
      if (authToken) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastr.error('Session Expired, Please login again.');
          localStorage.removeItem('token');
          this.router.navigate(['/']);
          this.authService.clearUserDetails();
        }
        return throwError(() => error);
      }),
      finalize(() => {
        if (bypassLoader) {
          this.loaderService.hideLoader();
        }
      })
    );
  }
}
