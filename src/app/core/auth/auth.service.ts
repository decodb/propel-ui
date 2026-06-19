import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthForgotPasswordResponse, AuthRegisterResponse, SignInDto } from './auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  constructor() { }

  adminLogin (dto: SignInDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/admin/login`, dto)
  }

  signUp (dto: FormData): Observable<AuthRegisterResponse> {
    return this.http.post<AuthRegisterResponse>(`${environment.apiUrl}/register`, dto)
  }

  verifyEmail(token: string): Observable<string> {
    return this.http.get(`${environment.apiUrl}/register/verify-email?token=${token}`, {
      responseType: 'text'
    });
  }

  forgotPassword(email: string): Observable<AuthForgotPasswordResponse> {
    return this.http.post<AuthForgotPasswordResponse>(`${environment.apiUrl}/auth/forgot-password`,
      { email }
    )
  }

  resetPassword(token: string, password: string): Observable<AuthForgotPasswordResponse> {
    return this.http.post<AuthForgotPasswordResponse>(`${environment.apiUrl}/auth/reset-password?token=${token}`,
      { password }
    )
  }
}
