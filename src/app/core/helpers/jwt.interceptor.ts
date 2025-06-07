import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthenticationService,
    private toast: ToastrService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.accessToken) {
      request = this.addToken(request, currentUser.accessToken);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        console.log("Error Status",error.status);
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !request.url.includes('/auth/refresh-token')
        ) {
          return this.handle401Error(request, next);
        }
        if (error instanceof HttpErrorResponse && error.status === 403) {
          this.toast.error('You do not have permission to access this resource.', 'Access Denied');
        } else if (error instanceof HttpErrorResponse && error.status === 404) {
          this.toast.error('The requested resource was not found.', 'Not Found');
        } else if (error instanceof HttpErrorResponse && error.status >= 500) {
          this.toast.error('An unexpected error occurred. Please try again later.', 'Server Error');
        } else {
          this.toast.error(error, 'Error');
        }
        return throwError(() => error);
      })
    );

    
    
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((tokenData: any) => {
          this.isRefreshing = false;

          const newToken = tokenData?.accessToken;
          this.authService.updateAccessToken(newToken);

          this.refreshTokenSubject.next(newToken);
          return next.handle(this.addToken(request, newToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => next.handle(this.addToken(request, token)))
      );
    }
  }
}
