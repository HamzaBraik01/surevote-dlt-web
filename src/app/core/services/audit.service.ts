import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuditLog, MetricsSummary, ParticipationBreakdown, FullMetrics, PageResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly observerUrl = `${environment.apiUrl}/api/observer`;

  constructor(private http: HttpClient) {}

  getFullMetrics(): Observable<FullMetrics> {
    return this.http.get<FullMetrics>(`${this.observerUrl}/metrics`);
  }

  getSummary(): Observable<MetricsSummary> {
    return this.http.get<MetricsSummary>(`${this.observerUrl}/metrics/summary`);
  }

  getParticipation(): Observable<ParticipationBreakdown[]> {
    return this.http.get<ParticipationBreakdown[]>(`${this.observerUrl}/metrics/participation`);
  }

  getLogs(page = 0, size = 20): Observable<PageResponse<AuditLog>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<AuditLog>>(`${this.observerUrl}/audit-logs`, { params });
  }

  getLogsByAction(actionType: string, page = 0, size = 20): Observable<PageResponse<AuditLog>> {
    const params = new HttpParams().set('actionType', actionType).set('page', page).set('size', size);
    return this.http.get<PageResponse<AuditLog>>(`${this.observerUrl}/audit-logs`, { params });
  }

  searchLogs(keyword: string, page = 0, size = 20): Observable<PageResponse<AuditLog>> {
    const params = new HttpParams().set('keyword', keyword).set('page', page).set('size', size);
    return this.http.get<PageResponse<AuditLog>>(`${this.observerUrl}/audit-logs`, { params });
  }

  getLogById(id: number): Observable<AuditLog> {
    return this.http.get<AuditLog>(`${this.observerUrl}/audit-logs/${id}`);
  }

  getActionTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.observerUrl}/audit-logs/types`);
  }

  getFraudAttempts(page = 0, size = 20): Observable<PageResponse<AuditLog>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<AuditLog>>(`${this.observerUrl}/audit-logs/fraud`, { params });
  }

  getByDateRange(from: string, to: string, page = 0, size = 20): Observable<PageResponse<AuditLog>> {
    const params = new HttpParams().set('from', from).set('to', to).set('page', page).set('size', size);
    return this.http.get<PageResponse<AuditLog>>(`${this.observerUrl}/audit-logs/date-range`, { params });
  }

  getByUser(userId: number, page = 0, size = 20): Observable<PageResponse<AuditLog>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<AuditLog>>(`${this.observerUrl}/audit-logs/user/${userId}`, { params });
  }

  getRecent(limit = 10): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.observerUrl}/audit-logs/recent`, { params: { limit } });
  }

  exportFull(): Observable<Blob> {
    return this.http.get(`${this.observerUrl}/export-logs`, { responseType: 'blob' });
  }

  exportByActionType(actionType: string): Observable<Blob> {
    return this.http.get(`${this.observerUrl}/export-logs`, { params: { actionType }, responseType: 'blob' });
  }
}
