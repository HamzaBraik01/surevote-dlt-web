export interface CollegeElectoral {
  id: number;
  nom: string;
  description: string;
  dateCreation?: string;
}

export interface CollegeRequest {
  nom: string;
  description: string;
}

export interface AddVoterRequest {
  electeurId: number;
}

export interface CollegeMember {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  cin: string;
}

export interface MembershipResponse {
  isMember: boolean;
}
