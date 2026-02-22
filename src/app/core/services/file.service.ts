import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Service for file upload and download operations */
@Injectable({ providedIn: 'root' })
export class FileService {
  private readonly adminUrl = `${environment.apiUrl}/api/admin/files`;
  private readonly publicUrl = `${environment.apiUrl}/api/files`;

  constructor(private http: HttpClient) {}

  uploadCandidatePhoto(candidatId: number, file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.adminUrl}/upload/photo/${candidatId}`, formData);
  }

  uploadCandidateProgram(candidatId: number, file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.adminUrl}/upload/program/${candidatId}`, formData);
  }

  uploadElectionFile(electionId: number, file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.adminUrl}/upload/election/${electionId}`, formData);
  }

  deleteFile(filePath: string): Observable<void> {
    return this.http.delete<void>(this.adminUrl, { params: { filePath } });
  }

  getDownloadUrl(filePath: string): string {
    return `${this.publicUrl}/download/${filePath}`;
  }
}
