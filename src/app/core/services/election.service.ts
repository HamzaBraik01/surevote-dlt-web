import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Election, CreateElectionRequest, UpdateElectionRequest,
  ElectionStats, ElectionResult, IntegrityReport, PageResponse
} from '../models';

@Injectable({ providedIn: 'root' })
export class ElectionService {
  private readonly adminUrl = `${environment.apiUrl}/api/admin/elections`;
  private readonly publicUrl = `${environment.apiUrl}/api/elections`;

  constructor(private http: HttpClient) {}

  // ── Admin Endpoints ──────────────────────────────────────
  create(data: CreateElectionRequest): Observable<Election> {
    return this.http.post<Election>(this.adminUrl, data);
  }

  list(): Observable<Election[]> {
    return this.http.get<any>(this.adminUrl).pipe(
      map(res => Array.isArray(res) ? res : (res.content ?? []))
    );
  }

  listPaged(page = 0, size = 20, sortBy = 'dateDebut', sortDir = 'desc'): Observable<PageResponse<Election>> {
    const params = new HttpParams()
      .set('page', page).set('size', size)
      .set('sortBy', sortBy).set('sortDir', sortDir);
    return this.http.get<PageResponse<Election>>(`${this.adminUrl}/paged`, { params });
  }

  getById(id: number): Observable<Election> {
    return this.http.get<Election>(`${this.adminUrl}/${id}`);
  }

  filterByStatus(statut: string): Observable<Election[]> {
    return this.http.get<Election[]>(`${this.adminUrl}/by-status`, { params: { statut } });
  }

  search(keyword: string): Observable<Election[]> {
    return this.http.get<Election[]>(`${this.adminUrl}/search`, { params: { keyword } });
  }

  update(id: number, data: UpdateElectionRequest): Observable<Election> {
    return this.http.put<Election>(`${this.adminUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }

  plan(id: number): Observable<Election> {
    return this.http.post<Election>(`${this.adminUrl}/${id}/plan`, {});
  }

  open(id: number): Observable<Election> {
    return this.http.post<Election>(`${this.adminUrl}/${id}/open`, {});
  }

  close(id: number): Observable<Election> {
    return this.http.post<Election>(`${this.adminUrl}/${id}/close`, {});
  }

  publish(id: number): Observable<Election> {
    return this.http.post<Election>(`${this.adminUrl}/${id}/publish`, {});
  }

  getResults(id: number): Observable<ElectionResult> {
    return this.http.get<ElectionResult>(`${this.adminUrl}/${id}/results`);
  }

  getStats(id: number): Observable<ElectionStats> {
    return this.http.get<ElectionStats>(`${this.adminUrl}/${id}/stats`);
  }

  verifyIntegrity(id: number): Observable<IntegrityReport> {
    return this.http.get<IntegrityReport>(`${this.adminUrl}/${id}/integrity`);
  }

  // ── Public Endpoints ─────────────────────────────────────
  listVisible(): Observable<Election[]> {
    return this.http.get<Election[]>(this.publicUrl);
  }

  searchPublic(keyword: string): Observable<Election[]> {
    return this.http.get<Election[]>(this.publicUrl, { params: { keyword } });
  }

  openElections(): Observable<Election[]> {
    return this.http.get<Election[]>(`${this.publicUrl}/open`);
  }

  publishedElections(): Observable<Election[]> {
    return this.http.get<Election[]>(`${this.publicUrl}/published`);
  }

  getPublicById(id: number): Observable<Election> {
    return this.http.get<Election>(`${this.publicUrl}/${id}`);
  }

  getPublicResults(id: number): Observable<ElectionResult> {
    return this.http.get<ElectionResult>(`${this.publicUrl}/${id}/results`);
  }
}
