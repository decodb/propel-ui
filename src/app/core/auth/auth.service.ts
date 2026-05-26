import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRegisterResponse } from './auth.model';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  constructor() { }

  signUp (dto: FormData): Observable<AuthRegisterResponse> {
    return this.http.post<AuthRegisterResponse>(`${environment.apiUrl}/register`, dto)
  }

  verifyEmail(token: string): Observable<string> {
    return this.http.get(`${environment.apiUrl}/register/verify-email?token=${token}`, {
      responseType: 'text'
    });
  }
}
