import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuditService } from './audit.service';

describe('AuditService', () => {
  let service: AuditService;
  let httpMock: HttpTestingController;
  const url = 'http://localhost:8080/api/observer';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuditService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should get full metrics', () => {
    service.getFullMetrics().subscribe();
    httpMock.expectOne(`${url}/metrics`).flush({});
  });

  it('should get summary', () => {
    service.getSummary().subscribe(d => expect(d.totalElections).toBe(5));
    httpMock.expectOne(`${url}/metrics/summary`).flush({ totalElections: 5 });
  });

  it('should get participation', () => {
    service.getParticipation().subscribe();
    httpMock.expectOne(`${url}/metrics/participation`).flush([]);
  });

  it('should get logs paged', () => {
    service.getLogs(0, 20).subscribe();
    httpMock.expectOne(r => r.url.includes('audit-logs')).flush({ content: [], totalElements: 0 });
  });

  it('should get action types', () => {
    service.getActionTypes().subscribe(d => expect(d.length).toBe(3));
    httpMock.expectOne(`${url}/audit-logs/types`).flush(['A', 'B', 'C']);
  });

  it('should get fraud attempts', () => {
    service.getFraudAttempts().subscribe();
    httpMock.expectOne(r => r.url.includes('fraud')).flush({ content: [] });
  });

  it('should get recent', () => {
    service.getRecent(5).subscribe();
    httpMock.expectOne(r => r.url.includes('recent')).flush([]);
  });

  it('should export', () => {
    service.exportFull().subscribe(blob => expect(blob).toBeTruthy());
    httpMock.expectOne(`${url}/export-logs`).flush(new Blob(['data']));
  });
});
