import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BlacklistStatsMonth {
  mois: string;
  count: number;
}
export interface WhitelistStatsMonth {
  mois: string;
  count: number;
}
export interface SegmentStats {
  segment: string;
  count: number;
}
export interface UserStats {
  username: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private baseUrl = 'http://localhost:8081/api/v1/dashboard';

  constructor(private http: HttpClient) {}

  private authHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) };
  }

  getBlacklistParMois(): Observable<BlacklistStatsMonth[]> {
    return this.http.get<BlacklistStatsMonth[]>(`${this.baseUrl}/blacklist-par-mois`, this.authHeaders());
  }
  getWhitelistParMois(): Observable<WhitelistStatsMonth[]> {
    return this.http.get<WhitelistStatsMonth[]>(`${this.baseUrl}/whitelist-par-mois`, this.authHeaders());
  }
  getBlacklistParSegment(): Observable<SegmentStats[]> {
    return this.http.get<SegmentStats[]>(`${this.baseUrl}/blacklist-par-segment`, this.authHeaders());
  }
  getBlacklistParUser(): Observable<UserStats[]> {
    return this.http.get<UserStats[]>(`${this.baseUrl}/blacklist-par-user`, this.authHeaders());
  }
}
