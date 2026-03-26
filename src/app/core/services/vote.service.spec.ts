import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { VoteService } from './vote.service';

describe('VoteService', () => {
  let service: VoteService;
  let httpMock: HttpTestingController;
  const voteUrl = 'http://localhost:8080/api/vote';
  const voterUrl = 'http://localhost:8080/api/voter';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VoteService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(VoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should check eligibility', () => {
    service.checkEligibility(1).subscribe(d => expect(d.eligible).toBeTruthy());
    httpMock.expectOne(`${voteUrl}/eligibility/1`).flush({ eligible: true });
  });

  it('should submit vote', () => {
    service.submitVote({ electionId: 1, candidatId: 2 }).subscribe(d => expect(d.recuCryptographique).toBe('abc'));
    const req = httpMock.expectOne(`${voteUrl}/submit`);
    expect(req.request.method).toBe('POST');
    req.flush({ recuCryptographique: 'abc' });
  });

  it('should get my votes (chained calls)', () => {
    service.getMyVotes().subscribe(d => expect(d.length).toBe(1));
    // getMyVotes() first calls getVoteSummary() which hits /my-votes
    httpMock.expectOne(`${voteUrl}/my-votes`).flush([{ electionId: 5 }]);
    // Then it calls getMyReceipt() for each electionId
    httpMock.expectOne(`${voteUrl}/my-receipt/5`).flush({ electionId: 5, recuCryptographique: 'abc' });
  });

  it('should get receipt', () => {
    service.getMyReceipt(1).subscribe();
    httpMock.expectOne(`${voteUrl}/my-receipt/1`).flush({});
  });

  it('should check integrity', () => {
    service.checkIntegrity(1).subscribe(d => expect(d.integre).toBeTruthy());
    httpMock.expectOne(`${voteUrl}/integrity/1`).flush({ integre: true });
  });

  it('should get eligible elections', () => {
    service.getEligibleElections().subscribe();
    httpMock.expectOne(`${voterUrl}/elections/eligible`).flush([]);
  });
});
