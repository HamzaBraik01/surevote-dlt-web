import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { VotingBoothComponent } from './voting-booth.component';
import { VoteService } from '../../../core/services/vote.service';
import { CandidatService } from '../../../core/services/candidat.service';
import { ElectionService } from '../../../core/services/election.service';
import { FileService } from '../../../core/services/file.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

describe('VotingBoothComponent', () => {
  let component: VotingBoothComponent;
  let fixture: ComponentFixture<VotingBoothComponent>;
  let voteService: any;
  let candidatService: any;
  let toastService: any;

  beforeEach(async () => {
    voteService = {
      checkEligibility: vi.fn().mockReturnValue(of({ eligible: true, aDejaVote: false, message: 'OK' })),
      submitVote: vi.fn().mockReturnValue(of({ id: 1, recuCryptographique: 'x', dateVote: '2026-01-01', electionId: 1 }))
    };
    candidatService = {
      getPublicCandidates: vi.fn().mockReturnValue(of([]))
    };
    toastService = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn()
    };
    const fileService = {
      getDownloadUrl: vi.fn().mockReturnValue('http://example.com/photo.jpg')
    };
    const authService = {
      getAccessToken: vi.fn(),
      isLoggedIn: false,
      currentUser: null
    };

    await TestBed.configureTestingModule({
      imports: [VotingBoothComponent],
      providers: [
        provideRouter([]),
        { provide: VoteService, useValue: voteService },
        { provide: CandidatService, useValue: candidatService },
        { provide: ElectionService, useValue: { getPublicById: vi.fn() } },
        { provide: FileService, useValue: fileService },
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VotingBoothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check eligibility on init', () => {
    expect(voteService.checkEligibility).toHaveBeenCalledWith(1);
  });

  it('should load candidates when eligible', () => {
    expect(candidatService.getPublicCandidates).toHaveBeenCalledWith(1);
  });

  it('should initialize with step 1', () => {
    expect(component.step).toBe(1);
  });

  it('should select a candidate', () => {
    const candidate = { id: 42, nom: 'Doe', prenom: 'John' } as any;
    component.selectCandidate(candidate);
    expect(component.selectedCandidat).toBe(candidate);
    expect(component.isBlankVote).toBe(false);
  });

  it('should submit vote when candidate is selected', () => {
    const receipt = { id: 1, recuCryptographique: 'abc123', dateVote: '2026-03-25', electionId: 1 };
    voteService.submitVote.mockReturnValue(of(receipt as any));
    component.selectedCandidat = { id: 42, nom: 'Test', prenom: 'User' } as any;
    component.step = 2;
    component.submitVote();
    expect(voteService.submitVote).toHaveBeenCalled();
  });
});
