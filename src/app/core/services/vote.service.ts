import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, forkJoin, catchError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { VoteRequest, VoteReceipt, VoteSummary, EligibilityResponse, VoteIntegrityResponse, Election } from '../models';

@Injectable({ providedIn: 'root' })
export class VoteService {
  private readonly voteUrl = `${environment.apiUrl}/api/vote`;
  private readonly voterUrl = `${environment.apiUrl}/api/voter`;

  constructor(private http: HttpClient) {}

  checkEligibility(electionId: number): Observable<EligibilityResponse> {
    return this.http.get<EligibilityResponse>(`${this.voteUrl}/eligibility/${electionId}`);
  }

  submitVote(data: VoteRequest): Observable<VoteReceipt> {
    return this.http.post<VoteReceipt>(`${this.voteUrl}/submit`, data);
  }

  /** Get summary of voter activity (votedElectionIds + totalVoted) */
  getVoteSummary(): Observable<VoteSummary> {
    return this.http.get<any>(`${this.voteUrl}/my-votes`).pipe(
      map(res => {
        // Handle both old array and new summary formats
        if (Array.isArray(res)) {
          return { votedElectionIds: res.map((r: any) => r.electionId), totalVoted: res.length };
        }
        if (res?.content && Array.isArray(res.content)) {
          return { votedElectionIds: res.content.map((r: any) => r.electionId), totalVoted: res.content.length };
        }
        return { votedElectionIds: res?.votedElectionIds ?? [], totalVoted: res?.totalVoted ?? 0 };
      })
    );
  }

  /** Get detailed receipts — fetches individual receipts for each voted election */
  getMyVotes(): Observable<VoteReceipt[]> {
    return this.getVoteSummary().pipe(
      switchMap(summary => {
        if (summary.votedElectionIds.length === 0) return of([]);
        return forkJoin(
          summary.votedElectionIds.map(eid =>
            this.getMyReceipt(eid).pipe(catchError(() => of(null)))
          )
        ).pipe(
          map(results => results.filter((r): r is VoteReceipt => r !== null))
        );
      })
    );
  }

  getMyReceipt(electionId: number): Observable<VoteReceipt> {
    return this.http.get<VoteReceipt>(`${this.voteUrl}/my-receipt/${electionId}`);
  }

  checkIntegrity(electionId: number): Observable<VoteIntegrityResponse> {
    return this.http.get<VoteIntegrityResponse>(`${this.voteUrl}/integrity/${electionId}`);
  }

  getEligibleElections(): Observable<Election[]> {
    return this.http.get<any>(`${this.voterUrl}/elections/eligible`).pipe(
      map(res => Array.isArray(res) ? res : (res?.content ?? []))
    );
  }

  /** Verify a vote receipt by its cryptographic code */
  verifyReceipt(receiptCode: string): Observable<{ valid: boolean }> {
    return this.http.get<{ valid: boolean }>(`${this.voteUrl}/verify-receipt`, { params: { code: receiptCode } });
  }
}
