export interface VoteRequest {
  electionId: number;
  candidatId: number;
}

export interface VoteReceipt {
  id: number;
  electionId: number;
  recuCryptographique: string;
  dateVote: string;
  electionTitre?: string;
}

export interface EligibilityResponse {
  eligible: boolean;
  raison?: string;
  aDejaVote?: boolean;
}

export interface VoteSummary {
  votedElectionIds: number[];
  totalVoted: number;
}

export interface VoteIntegrityResponse {
  integre: boolean;
  hash: string;
  details?: string;
}
