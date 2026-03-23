import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;
  let httpMock: HttpTestingController;
  const adminUrl = 'http://localhost:8080/api/admin/files';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should upload photo', () => {
    const file = new File([''], 'photo.jpg');
    service.uploadCandidatePhoto(1, file).subscribe();
    const req = httpMock.expectOne(`${adminUrl}/upload/photo/1`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should upload program', () => {
    const file = new File([''], 'program.pdf');
    service.uploadCandidateProgram(1, file).subscribe();
    httpMock.expectOne(`${adminUrl}/upload/program/1`).flush({});
  });

  it('should delete file', () => {
    service.deleteFile('some/path.jpg').subscribe();
    httpMock.expectOne(r => r.url === adminUrl && r.method === 'DELETE').flush(null);
  });

  it('should get download url', () => {
    const url = service.getDownloadUrl('img/photo.jpg');
    expect(url).toContain('download/img/photo.jpg');
  });
});
