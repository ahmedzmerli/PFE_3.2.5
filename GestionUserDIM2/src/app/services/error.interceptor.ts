// ✅ ErrorInterceptor (redirige vers login sur 401/403 et affiche des erreurs)
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('fullName');
          this.router.navigate(['/login']);
          this.snackBar.open('⛔ Session expirée ou non autorisée.', 'Fermer', {
            duration: 3000
          });
        } else if (error.status === 403) {
          this.snackBar.open('⛔ Accès interdit : vous n’avez pas la permission.', 'Fermer', {
            duration: 3000
          });
          this.router.navigate(['/forbidden']);
        } else if (error.status >= 500) {
          this.snackBar.open('❌ Erreur serveur. Veuillez réessayer plus tard.', 'Fermer', {
            duration: 3000
          });
        }

        return throwError(() => error);
      })
    );
  }
}


