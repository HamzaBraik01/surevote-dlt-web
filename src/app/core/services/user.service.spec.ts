import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const url = 'http://localhost:8080/api/admin/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create user', () => {
    service.create({ cin: '1', nom: 'A', prenom: 'B', email: 'a@b.com', role: 'ELECTEUR', generateRandomPassword: true }).subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1 });
  });

  it('should list users', () => {
    service.list().subscribe(d => expect(d.length).toBe(2));
    httpMock.expectOne(url).flush([{ id: 1 }, { id: 2 }]);
  });

  it('should list paged', () => {
    service.listPaged(0, 10).subscribe();
    httpMock.expectOne(r => r.url.includes('/paged')).flush({ content: [], totalElements: 0, totalPages: 0, number: 0 });
  });

  it('should list by role', () => {
    service.listByRole('ADMIN').subscribe();
    httpMock.expectOne(`${url}/role/ADMIN`).flush([]);
  });

  it('should update role', () => {
    service.updateRole(1, { role: 'ADMIN' }).subscribe();
    const req = httpMock.expectOne(`${url}/1/role`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 1 });
  });

  it('should activate', () => {
    service.activate(1).subscribe();
    httpMock.expectOne(`${url}/1/activate`).flush({ id: 1 });
  });

  it('should deactivate', () => {
    service.deactivatePut(1).subscribe();
    httpMock.expectOne(`${url}/1/deactivate`).flush({ id: 1 });
  });

  it('should get stats', () => {
    service.getStats().subscribe(d => expect(d.totalUsers).toBe(100));
    httpMock.expectOne(`${url}/stats`).flush({ totalUsers: 100 });
  });
});
