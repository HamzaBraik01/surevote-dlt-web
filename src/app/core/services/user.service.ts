import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Utilisateur, CreateUserRequest, UpdateRoleRequest, UserStats, PageResponse } from '../models';

/** Service for admin user management and profile operations */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly url = `${environment.apiUrl}/api/admin/users`;
  private readonly profileUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  /** Update the current user's profile */
  updateProfile(data: { nom: string; prenom: string; telephone: string }): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.profileUrl}/profile`, data);
  }

  create(data: CreateUserRequest): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.url, data);
  }

  list(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.url);
  }

  listPaged(page = 0, size = 20, sortBy = 'id', sortDir = 'desc'): Observable<PageResponse<Utilisateur>> {
    const params = new HttpParams()
      .set('page', page).set('size', size)
      .set('sortBy', sortBy).set('sortDir', sortDir);
    return this.http.get<PageResponse<Utilisateur>>(`${this.url}/paged`, { params });
  }

  search(keyword: string): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.url, { params: { keyword } });
  }

  filterByRole(role: string): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.url, { params: { role } });
  }

  getById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.url}/${id}`);
  }

  listByRole(role: string): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.url}/role/${role}`);
  }

  updateRole(id: number, data: UpdateRoleRequest): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.url}/${id}/role`, data);
  }

  activate(id: number): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.url}/${id}/activate`, {});
  }

  deactivatePut(id: number): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.url}/${id}/deactivate`, {});
  }

  getStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.url}/stats`);
  }

  getAdminProfile(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.url}/me`);
  }
}
