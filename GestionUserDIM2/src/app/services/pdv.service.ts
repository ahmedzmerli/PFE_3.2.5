import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PdvMaster} from "../models/pdvmaster.model";
import {PdvHistory} from "../models/pdvhistory.model";


@Injectable({
  providedIn: 'root'
})
export class PdvService {
  private baseUrl = 'http://localhost:8081/api/v1/pdv';
  private historyUrl = 'http://localhost:8081/api/v1/pdv-history';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PdvMaster[]> {
    return this.http.get<PdvMaster[]>(this.baseUrl);
  }

  create(pdv: PdvMaster): Observable<void> {
    return this.http.post<void>(this.baseUrl, pdv);
  }

  delete(msisdn: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${msisdn}`);
  }

  getHistory(): Observable<PdvHistory[]> {
    return this.http.get<PdvHistory[]>(this.historyUrl);
  }
}
