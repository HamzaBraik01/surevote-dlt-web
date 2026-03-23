import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CandidatService } from './candidat.service';

describe('CandidatService', () => {
  let service: CandidatService;
  let httpMock: HttpTestingController;
  const electionUrl = 'http://localhost:8080/api/admin/elections';
  const candidatUrl = 'http://localhost:8080/api/admin/candidates';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CandidatService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CandidatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should add candidate', () => {
    service.add(1, { nom: 'A', prenom: 'B', affiliationOuParti: 'X', biographie: 'Bio' }).subscribe();
    const req = httpMock.expectOne(`${electionUrl}/1/candidates`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1 });
  });

  it('should list by election', () => {
    service.listByElection(1).subscribe(d => expect(d.length).toBe(3));
    httpMock.expectOne(`${electionUrl}/1/candidates`).flush([{}, {}, {}]);
  });

  it('should get by id', () => {
    service.getById(1).subscribe();
    httpMock.expectOne(`${candidatUrl}/1`).flush({ id: 1 });
  });

  it('should update', () => {
    service.update(1, { nom: 'X', prenom: 'Y', affiliationOuParti: 'Z', biographie: 'Bio' }).subscribe();
    const req = httpMock.expectOne(`${candidatUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should delete', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne(`${candidatUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should update photo', () => {
    service.updatePhoto(1, { photoUrl: 'url' }).subscribe();
    httpMock.expectOne(`${candidatUrl}/1/photo`).flush({});
  });

  it('should get public candidates', () => {
    service.getPublicCandidates(1).subscribe();
    httpMock.expectOne('http://localhost:8080/api/elections/1/candidates').flush([]);
  });
});
