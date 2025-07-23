import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  AuthenticationRequest,
  AuthenticationResponse,
  RegistrationRequest
} from '../models/auth';
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = 'http://localhost:8081/api/v1/auth';

  constructor(private http: HttpClient , private tokenService:TokenService) {}

  register(data: RegistrationRequest): Observable<void> {
    return this.http.post<void>(`${this.BASE_URL}/register`, data);
  }

  authenticate(data: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.BASE_URL}/authenticate`, data).pipe(
      tap(response => {
        this.tokenService.saveToken(response.token); // 👈 met aussi le nom complet
        const permissions = this.tokenService.getAuthorities(); // 🧠 extrait les authorities du token
        localStorage.setItem('permissions', JSON.stringify(permissions));
        window.dispatchEvent(new Event('permissions-updated'));
      })
    );
  }


  activateAccount(token: string): Observable<void> {
    const params = new HttpParams().set('token', token);
    return this.http.get<void>(`${this.BASE_URL}/activate-account`, { params });
  }

  resendToken(email: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/resend-token`, null, {
      params: { email },
      responseType: 'text'
    });
  }

changePassword(oldPassword: string, newPassword: string) {
  const body = {
    oldPassword: oldPassword,
    newPassword: newPassword
  };
  return this.http.post(`${this.BASE_URL}/change-password`, body);
}



}
