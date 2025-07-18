import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private apiUrl = 'http://localhost:8081/api/v1/roles';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // assignPermissionLists(roleName: string, permissionListIds: number[]): Observable<Role> {
  //   return this.http.post<Role>(`${this.apiUrl}/assign-permission-lists?roleName=${roleName}`, permissionListIds, { headers: this.getHeaders() });
  // }

  createRoleWithPermissionLists(name: string, permissionListIds: number[]): Observable<Role> {
    return this.http.post<Role>(
      `${this.apiUrl}?name=${name}`,
      permissionListIds,
      { headers: this.getHeaders() }
    );
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateRole(id: number, name: string, permissionListIds: number[]): Observable<Role> {
    return this.http.put<Role>(
      `${this.apiUrl}/${id}?name=${name}`,
      permissionListIds,
      { headers: this.getHeaders() }
    );
  }


}
