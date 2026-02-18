import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Candidat, CandidatRequest, UpdatePhotoRequest, UpdateProgrammeRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class CandidatService {
  private readonly adminElectionUrl = `${environment.apiUrl}/api/admin/elections`;
  private readonly adminCandidatUrl = `${environment.apiUrl}/api/admin/candidates`;
  private readonly publicUrl = `${environment.apiUrl}/api/elections`;

  constructor(private http: HttpClient) {}

  // ── Admin (under election) ───────────────────────────────
  add(electionId: number, data: CandidatRequest): Observable<Candidat> {
    return this.http.post<Candidat>(`${this.adminElectionUrl}/${electionId}/candidates`, data);
  }

  listByElection(electionId: number): Observable<Candidat[]> {
    return this.http.get<Candidat[]>(`${this.adminElectionUrl}/${electionId}/candidates`);
  }

  countByElection(electionId: number): Observable<number> {
    return this.http.get<number>(`${this.adminElectionUrl}/${electionId}/candidates/count`);
  }

  // ── Admin (direct candidate) ─────────────────────────────
  getById(id: number): Observable<Candidat> {
    return this.http.get<Candidat>(`${this.adminCandidatUrl}/${id}`);
  }

  update(id: number, data: CandidatRequest): Observable<Candidat> {
    return this.http.put<Candidat>(`${this.adminCandidatUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminCandidatUrl}/${id}`);
  }

  updatePhoto(id: number, data: UpdatePhotoRequest): Observable<Candidat> {
    return this.http.patch<Candidat>(`${this.adminCandidatUrl}/${id}/photo`, data);
  }

  updateProgramme(id: number, data: UpdateProgrammeRequest): Observable<Candidat> {
    return this.http.patch<Candidat>(`${this.adminCandidatUrl}/${id}/programme`, data);
  }

  // ── Public ───────────────────────────────────────────────
  getPublicCandidates(electionId: number): Observable<Candidat[]> {
    return this.http.get<Candidat[]>(`${this.publicUrl}/${electionId}/candidates`);
  }

  getPublicCandidateById(electionId: number, candidatId: number): Observable<Candidat> {
    return this.http.get<Candidat>(`${this.publicUrl}/${electionId}/candidates/${candidatId}`);
  }
}
