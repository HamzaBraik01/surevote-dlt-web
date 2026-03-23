import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CollegeService } from './college.service';

describe('CollegeService', () => {
  let service: CollegeService;
  let httpMock: HttpTestingController;
  const url = 'http://localhost:8080/api/admin/colleges';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollegeService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CollegeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create college', () => {
    service.create({ nom: 'Test', description: '' }).subscribe();
    httpMock.expectOne(url).flush({ id: 1 });
  });

  it('should list', () => {
    service.list().subscribe();
    httpMock.expectOne(url).flush([]);
  });

  it('should get by id', () => {
    service.getById(1).subscribe();
    httpMock.expectOne(`${url}/1`).flush({ id: 1 });
  });

  it('should update', () => {
    service.update(1, { nom: 'New', description: '' }).subscribe();
    const req = httpMock.expectOne(`${url}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should delete', () => {
    service.delete(1).subscribe();
    httpMock.expectOne(`${url}/1`).flush(null);
  });

  it('should list members', () => {
    service.listMembers(1).subscribe(d => expect(d.length).toBe(2));
    httpMock.expectOne(`${url}/1/voters`).flush([{}, {}]);
  });

  it('should add voter', () => {
    service.addVoter(1, { electeurId: 42 }).subscribe();
    const req = httpMock.expectOne(`${url}/1/voters`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should remove voter', () => {
    service.removeVoter(1, 42).subscribe();
    httpMock.expectOne(`${url}/1/voters/42`).flush(null);
  });

  it('should check membership', () => {
    service.checkMembership(1, 42).subscribe();
    httpMock.expectOne(`${url}/1/voters/42/membership`).flush({ member: true });
  });
});
