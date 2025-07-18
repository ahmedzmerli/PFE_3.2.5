// src/app/services/history.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {BlHistory} from "../models/history.model";


@Injectable({ providedIn: 'root' })
export class HistoryService {
  private baseUrl = 'http://localhost:8081/api/v1/blhistory';

  constructor(private http: HttpClient) {}

  searchHistory(msisdn: string, start?: Date, end?: Date): Observable<BlHistory[]> {
    let params = new HttpParams().set('msisdn', msisdn);

    if (start) params = params.set('start', start.toISOString());
    if (end) params = params.set('end', end.toISOString());

    return this.http.get<BlHistory[]>(this.baseUrl, { params });
  }
}
