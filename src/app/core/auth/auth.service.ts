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
}
