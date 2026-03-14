import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ElectionsComponent } from './elections.component';
import { ElectionService } from '../../../core/services/election.service';
import { CollegeService } from '../../../core/services/college.service';
import { ToastService } from '../../../core/services/toast.service';

describe('ElectionsComponent', () => {
  let component: ElectionsComponent;
  let fixture: ComponentFixture<ElectionsComponent>;
  let electionService: any;
  let collegeService: any;
  let toastService: any;

  const mockPage = {
    content: [
      { id: 1, titre: 'Élection 1', statut: 'OUVERTE', dateDebut: '2026-01-01', dateFin: '2026-12-31' },
      { id: 2, titre: 'Élection 2', statut: 'BROUILLON', dateDebut: '2026-02-01', dateFin: '2026-12-31' }
    ],
    number: 0, totalPages: 1, totalElements: 2,
    size: 10, first: true, last: true, empty: false
  };

  beforeEach(async () => {
    electionService = {
      listPaged: vi.fn().mockReturnValue(of(mockPage as any)),
      create: vi.fn(),
      delete: vi.fn(),
      plan: vi.fn(),
      open: vi.fn(),
      close: vi.fn(),
      publish: vi.fn(),
      search: vi.fn(),
      filterByStatus: vi.fn()
    };
    collegeService = {
      list: vi.fn().mockReturnValue(of([]))
    };
    toastService = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ElectionsComponent],
      providers: [
        provideRouter([]),
        { provide: ElectionService, useValue: electionService },
        { provide: CollegeService, useValue: collegeService },
        { provide: ToastService, useValue: toastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load elections on init', () => {
    expect(electionService.listPaged).toHaveBeenCalledWith(0, 10);
  });

  it('should populate elections array', () => {
    expect(component.elections.length).toBe(2);
  });

  it('should count active elections', () => {
    expect(component.activeCount).toBe(1);
  });

  it('should count draft elections', () => {
    expect(component.draftCount).toBe(1);
  });

  it('should set total elements', () => {
    expect(component.totalElements).toBe(2);
  });

  it('should call search when query is entered', () => {
    electionService.search.mockReturnValue(of([mockPage.content[0]] as any));
    component.searchQuery = 'Élection 1';
    component.onSearch();
    expect(electionService.search).toHaveBeenCalledWith('Élection 1');
  });

  it('should filter by status', () => {
    electionService.filterByStatus.mockReturnValue(of([mockPage.content[0]] as any));
    component.filterStatus = 'OUVERTE';
    component.onFilterChange();
    expect(electionService.filterByStatus).toHaveBeenCalledWith('OUVERTE');
  });

  it('should set loading to false after load', () => {
    expect(component.loading).toBe(false);
  });

  it('should create election on valid form', () => {
    electionService.create.mockReturnValue(of(mockPage.content[0] as any));
    component.createForm.patchValue({
      titre: 'New', description: 'Desc',
      dateDebut: '2026-01-01T00:00', dateFin: '2026-12-31T23:59'
    });
    component.createElection();
    expect(electionService.create).toHaveBeenCalled();
  });
});
