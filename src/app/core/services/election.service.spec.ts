import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ElectionService } from './election.service';

describe('ElectionService', () => {
  let service: ElectionService;
  let httpMock: HttpTestingController;
  const adminUrl = 'http://localhost:8080/api/admin/elections';
  const publicUrl = 'http://localhost:8080/api/elections';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectionService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ElectionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create an election', () => {
    service.create({ titre: 'Test', description: '', dateDebut: '', dateFin: '' }).subscribe();
    const req = httpMock.expectOne(adminUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1 });
  });

  it('should list elections', () => {
    service.list().subscribe(d => expect(d.length).toBe(2));
    httpMock.expectOne(adminUrl).flush([{ id: 1 }, { id: 2 }]);
  });

  it('should list paged elections', () => {
    service.listPaged(0, 10).subscribe(d => expect(d.totalElements).toBe(50));
    const req = httpMock.expectOne(r => r.url.includes('/paged'));
    expect(req.request.params.get('page')).toBe('0');
    req.flush({ content: [], totalElements: 50, totalPages: 5, number: 0 });
  });

  it('should get by id', () => {
    service.getById(1).subscribe(d => expect(d.titre).toBe('Test'));
    httpMock.expectOne(`${adminUrl}/1`).flush({ id: 1, titre: 'Test' });
  });

  it('should filter by status', () => {
    service.filterByStatus('OUVERTE').subscribe();
    httpMock.expectOne(r => r.url.includes('by-status')).flush([]);
  });

  it('should search', () => {
    service.search('leg').subscribe();
    httpMock.expectOne(r => r.url.includes('search')).flush([]);
  });

  it('should update', () => {
    service.update(1, { titre: 'Updated', description: '', dateDebut: '', dateFin: '' }).subscribe();
    const req = httpMock.expectOne(`${adminUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 1 });
  });

  it('should delete', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne(`${adminUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should plan an election', () => {
    service.plan(1).subscribe();
    httpMock.expectOne(`${adminUrl}/1/plan`).flush({ id: 1 });
  });

  it('should open an election', () => {
    service.open(1).subscribe();
    httpMock.expectOne(`${adminUrl}/1/open`).flush({ id: 1 });
  });

  it('should close an election', () => {
    service.close(1).subscribe();
    httpMock.expectOne(`${adminUrl}/1/close`).flush({ id: 1 });
  });

  it('should publish an election', () => {
    service.publish(1).subscribe();
    httpMock.expectOne(`${adminUrl}/1/publish`).flush({ id: 1 });
  });

  it('should get public elections', () => {
    service.listVisible().subscribe();
    httpMock.expectOne(publicUrl).flush([]);
  });

  it('should get public results', () => {
    service.getPublicResults(1).subscribe();
    httpMock.expectOne(`${publicUrl}/1/results`).flush({});
  });
});
