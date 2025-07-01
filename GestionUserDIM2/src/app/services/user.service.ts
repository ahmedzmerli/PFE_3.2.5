import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import {map} from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:8081/api/v1/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<{ count: number, users: User[] }>(this.baseUrl)
      .pipe(
        map(response => response.users)
      );
  }


  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user); // Only if you enable POST
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  addRole(userId: number, roleId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${userId}/roles/${roleId}`, {});
  }

  removeRole(userId: number, roleId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}/roles/${roleId}`);
  }

  getUserRoles(id: number): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/${id}/roles`);
  }

  resendToken(email: string): Observable<any> {
    return this.http.post(`http://localhost:8081/api/v1/auth/resend-token?email=${email}`, {});
  }

}
