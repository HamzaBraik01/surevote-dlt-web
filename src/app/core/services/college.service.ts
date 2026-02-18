import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CollegeElectoral, CollegeRequest, CollegeMember, AddVoterRequest, MembershipResponse, PageResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class CollegeService {
  private readonly url = `${environment.apiUrl}/api/admin/colleges`;

  constructor(private http: HttpClient) {}

  create(data: CollegeRequest): Observable<CollegeElectoral> {
    return this.http.post<CollegeElectoral>(this.url, data);
  }

  list(): Observable<CollegeElectoral[]> {
    return this.http.get<CollegeElectoral[]>(this.url);
  }

  listPaged(page = 0, size = 20, sortBy = 'nom', sortDir = 'asc'): Observable<PageResponse<CollegeElectoral>> {
    const params = new HttpParams()
      .set('page', page).set('size', size)
      .set('sortBy', sortBy).set('sortDir', sortDir);
    return this.http.get<PageResponse<CollegeElectoral>>(`${this.url}/paged`, { params });
  }

  search(keyword: string): Observable<CollegeElectoral[]> {
    return this.http.get<CollegeElectoral[]>(this.url, { params: { keyword } });
  }

  getById(id: number): Observable<CollegeElectoral> {
    return this.http.get<CollegeElectoral>(`${this.url}/${id}`);
  }

  update(id: number, data: CollegeRequest): Observable<CollegeElectoral> {
    return this.http.put<CollegeElectoral>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  listMembers(collegeId: number): Observable<CollegeMember[]> {
    return this.http.get<CollegeMember[]>(`${this.url}/${collegeId}/voters`);
  }

  countMembers(collegeId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/${collegeId}/voters/count`);
  }

  addVoter(collegeId: number, data: AddVoterRequest): Observable<void> {
    return this.http.post<void>(`${this.url}/${collegeId}/voters`, data);
  }

  removeVoter(collegeId: number, electeurId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${collegeId}/voters/${electeurId}`);
  }

  checkMembership(collegeId: number, electeurId: number): Observable<MembershipResponse> {
    return this.http.get<MembershipResponse>(`${this.url}/${collegeId}/voters/${electeurId}/membership`);
  }
}
