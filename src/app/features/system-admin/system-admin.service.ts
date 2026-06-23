import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company, CompanyFilters, PaginatedResponse } from './system-admin.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemAdminService {

  constructor(private http: HttpClient) { }

  findAll(filters: CompanyFilters): Observable<PaginatedResponse<Company>> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginatedResponse<any>>(`${environment.apiUrl}/companies`, { params });
  }
}
