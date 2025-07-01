import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Permission } from '../models/permission.model';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private apiUrl = 'http://localhost:8081/api/v1/permissions';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  create(p: Permission): Observable<Permission> {
    return this.http.post<Permission>(this.apiUrl, p, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getDistinctValues(): Observable<{ features: string[], actions: string[] }> {
    return this.http.get<{ features: string[], actions: string[] }>(
      `${this.apiUrl}/distinct`,
      { headers: this.getHeaders() }
    );
  }

  
}
