export interface Election {
  id: number;
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  statut: ElectionStatut;
  collegeElectoralId?: number;
  dateCreation?: string;
  dateModification?: string;
}

export type ElectionStatut = 'BROUILLON' | 'PLANIFIEE' | 'OUVERTE' | 'CLOTUREE' | 'PUBLIEE';

export interface CreateElectionRequest {
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  collegeElectoralId?: number | null;
}

export interface UpdateElectionRequest {
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
}

export interface ElectionStats {
  totalVotes: number;
  totalElecteurs: number;
  tauxParticipation: number;
  votesParHeure?: Record<string, number>;
}

export interface ElectionResult {
  electionId: number;
  titre: string;
  resultats: CandidatResult[];
  totalVotes: number;
  tauxParticipation: number;
  voteBlanc?: number;
}

export interface CandidatResult {
  candidatId: number;
  nom: string;
  prenom: string;
  affiliationOuParti: string;
  nombreVoix: number;
  pourcentage: number;
  photoUrl?: string;
}

export interface IntegrityReport {
  electionId: number;
  integre: boolean;
  totalVotes: number;
  hashChain: string;
  details?: string;
}
