import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dashboard } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:8081/api/v1/dashboard';

  constructor(private http: HttpClient) {}

  searchDashboard(
    msisdn: string,
    hotline: string,
    startDate?: Date,
    endDate?: Date
  ): Observable<Dashboard[]> {
    let params = new HttpParams()
      .set('msisdn', msisdn)
      .set('hotline', hotline);

    if (startDate) {
      params = params.set('start', this.formatDateTime(startDate));
    }
    if (endDate) {
      params = params.set('end', this.formatDateTime(endDate));
    }
    return this.http.get<Dashboard[]>(this.baseUrl, { params });
  }

  private formatDateTime(date: Date): string {
    // Format: YYYY-MM-DDTHH:mm:ss
    // Utilisé par Spring Boot (ISO_LOCAL_DATE_TIME)
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return date.getFullYear() + '-' +
      pad(date.getMonth() + 1) + '-' +
      pad(date.getDate()) + 'T' +
      pad(date.getHours()) + ':' +
      pad(date.getMinutes()) + ':' +
      pad(date.getSeconds());
  }
}
