export interface AuditLog {
  id: number;
  actionType: string;
  utilisateurId?: number;
  utilisateurEmail?: string;
  userId?: number;
  userName?: string;
  adresseIp?: string;
  ipAddress?: string;
  details: string;
  dateAction: string;
  timestamp?: string;
  severity?: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface MetricsSummary {
  totalElections: number;
  electionsPubliees: number;
  electionsOuvertes: number;
  activeElections?: number;
  totalUtilisateurs: number;
  totalElecteurs: number;
  totalVotesCastes: number;
  totalVotesCast?: number;
  tauxParticipationMoyen: number;
  averageParticipation?: number;
  totalLogsAudit: number;
  totalColleges: number;
}

export interface ParticipationBreakdown {
  electionId: number;
  titre: string;
  statut: string;
  totalElecteursEligibles: number;
  totalElecteurs?: number;
  totalVotes: number;
  votesExprimes?: number;
  tauxParticipation: number;
  totalCandidats: number;
  dateFin: string;
}

export interface FullMetrics {
  summary: MetricsSummary;
  participationByElection: ParticipationBreakdown[];
  recentActivity: AuditLog[];
}
