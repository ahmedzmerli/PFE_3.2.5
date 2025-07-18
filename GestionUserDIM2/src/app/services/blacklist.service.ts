import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blacklist } from '../models/blacklist.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlacklistService {
  private baseUrl = 'http://localhost:8081/api/v1/blacklist';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Blacklist[]> {
    return this.http.get<Blacklist[]>(this.baseUrl);
  }

  toggle(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/toggle/${id}`, {});
  }
}
