import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PermissionList } from '../models/permission-list.model';

@Injectable({ providedIn: 'root' })
export class PermissionListService {
  private apiUrl = 'http://localhost:8081/api/v1/permission-lists';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(): Observable<PermissionList[]> {
    return this.http.get<PermissionList[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  create(name: string, permissionIds: number[]): Observable<PermissionList> {
    return this.http.post<PermissionList>(`${this.apiUrl}?name=${name}`, permissionIds, { headers: this.getHeaders() });
  }

  update(id: number, name: string, permissionIds: number[]): Observable<PermissionList> {
    return this.http.put<PermissionList>(`${this.apiUrl}/${id}?name=${name}`, permissionIds, {
      headers: this.getHeaders()
    });
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
  

}
